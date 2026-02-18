const dbconnection = require("../db/dbconfig");

// Get user profile with stats
async function getUserProfile(req, res) {
  const { userid } = req.params;
  
  console.log("[getUserProfile] Request for userid:", userid);
  
  if (!userid) {
    return res.status(400).json({ msg: "User ID is required" });
  }

  try {
    // Start with basic user info query
    const [userResult] = await dbconnection.query(
      "SELECT userid, username, firstname, lastname, email, created_at FROM users WHERE userid = ?",
      [userid]
    );

    if (userResult.length === 0) {
      console.log("[getUserProfile] User not found:", userid);
      return res.status(404).json({ msg: "User not found" });
    }

    const user = userResult[0];
    console.log("[getUserProfile] Found user:", user.username);
    
    // Set default profile fields (will be null until migration is applied)
    user.bio = null;
    user.location = null;
    user.website = null;

    // Get user statistics with error handling
    let totalQuestions = 0;
    let totalAnswers = 0;
    let votesReceived = 0;

    try {
      const [questionStats] = await dbconnection.query(
        "SELECT COUNT(*) as totalQuestions FROM question WHERE userid = ?",
        [userid]
      );
      totalQuestions = questionStats[0]?.totalQuestions || 0;
      console.log("[getUserProfile] Questions:", totalQuestions);
    } catch (error) {
      console.log("[getUserProfile] Error fetching question stats:", error.message);
    }

    try {
      const [answerStats] = await dbconnection.query(
        "SELECT COUNT(*) as totalAnswers FROM answer WHERE userid = ?",
        [userid]
      );
      totalAnswers = answerStats[0]?.totalAnswers || 0;
      console.log("[getUserProfile] Answers:", totalAnswers);
    } catch (error) {
      console.log("[getUserProfile] Error fetching answer stats:", error.message);
    }

    // Get vote statistics (votes received on user's content) - handle missing votes table
    try {
      const [questionVotes] = await dbconnection.query(
        `SELECT COALESCE(SUM(v.vote_type), 0) as questionVotes 
         FROM votes v 
         JOIN question q ON v.questionid = q.questionid 
         WHERE q.userid = ?`,
        [userid]
      );

      const [answerVotes] = await dbconnection.query(
        `SELECT COALESCE(SUM(v.vote_type), 0) as answerVotes 
         FROM votes v 
         JOIN answer a ON v.answerid = a.answerid 
         WHERE a.userid = ?`,
        [userid]
      );

      votesReceived = (questionVotes[0]?.questionVotes || 0) + (answerVotes[0]?.answerVotes || 0);
      console.log("[getUserProfile] Votes received:", votesReceived);
    } catch (voteError) {
      console.log("[getUserProfile] Votes table not found or error:", voteError.message);
      votesReceived = 0;
    }

    // Calculate basic reputation with accepted answers bonus
    let acceptedAnswersCount = 0;
    try {
      const [acceptedAnswers] = await dbconnection.query(
        "SELECT COUNT(*) as acceptedCount FROM answer WHERE userid = ? AND is_accepted = 1",
        [userid]
      );
      acceptedAnswersCount = acceptedAnswers[0]?.acceptedCount || 0;
      console.log("[getUserProfile] Accepted answers:", acceptedAnswersCount);
    } catch (error) {
      console.log("[getUserProfile] is_accepted column not found:", error.message);
      acceptedAnswersCount = 0;
    }

    // Reputation formula: votes*10 + questions*2 + answers*5 + accepted_answers*15
    const reputation = Math.max(1, 
      votesReceived * 10 + 
      totalQuestions * 2 + 
      totalAnswers * 5 + 
      acceptedAnswersCount * 15
    );

    // Get recent questions (last 5) with error handling
    let recentQuestions = [];
    try {
      const [questions] = await dbconnection.query(
        `SELECT questionid, title, created_at,
         (SELECT COUNT(*) FROM answer WHERE questionid = question.questionid) as answerCount
         FROM question 
         WHERE userid = ? 
         ORDER BY created_at DESC 
         LIMIT 5`,
        [userid]
      );
      recentQuestions = questions || [];
    } catch (error) {
      console.log("[getUserProfile] Error fetching recent questions:", error.message);
    }

    // Get recent answers (last 5) with error handling
    let recentAnswers = [];
    try {
      const [answers] = await dbconnection.query(
        `SELECT a.answerid, a.answer, a.created_at, q.title as questionTitle, q.questionid
         FROM answer a
         JOIN question q ON a.questionid = q.questionid
         WHERE a.userid = ?
         ORDER BY a.created_at DESC
         LIMIT 5`,
        [userid]
      );
      recentAnswers = answers || [];
    } catch (error) {
      console.log("[getUserProfile] Error fetching recent answers:", error.message);
    }

    const profile = {
      user: {
        ...user,
        joinedDate: user.created_at
      },
      stats: {
        totalQuestions: totalQuestions,
        totalAnswers: totalAnswers,
        reputation: reputation,
        votesReceived: votesReceived,
        acceptedAnswers: acceptedAnswersCount
      },
      recentActivity: {
        questions: recentQuestions,
        answers: recentAnswers
      }
    };

    console.log("[getUserProfile] Profile created successfully for:", user.username);
    res.status(200).json({ msg: "Profile fetched successfully", profile });

  } catch (error) {
    console.error("[getUserProfile] Error fetching user profile:", error);
    res.status(500).json({ 
      msg: "Error fetching user profile",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}

// Update user profile
async function updateUserProfile(req, res) {
  const { bio, location, website } = req.body;
  const userid = req.user.userid;

  try {
    // Check if profile columns exist before trying to update
    try {
      await dbconnection.query("SELECT bio FROM users LIMIT 1");
      
      // Profile columns exist, proceed with update
      await dbconnection.query(
        "UPDATE users SET bio = ?, location = ?, website = ? WHERE userid = ?",
        [bio || null, location || null, website || null, userid]
      );
      
      res.status(200).json({ msg: "Profile updated successfully" });
    } catch (columnError) {
      // Profile columns don't exist
      res.status(400).json({ 
        msg: "Profile fields not available. Database needs to be updated with profile columns.",
        note: "Contact administrator to run database migration."
      });
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ msg: "Error updating profile" });
  }
}

// Get current user's own profile (with private info)
async function getMyProfile(req, res) {
  const userid = req.user.userid;
  
  console.log("[getMyProfile] Request for userid:", userid);
  
  try {
    // Get user info - start with basic fields
    const [userResult] = await dbconnection.query(
      "SELECT userid, username, firstname, lastname, email, created_at FROM users WHERE userid = ?",
      [userid]
    );

    if (userResult.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    const user = userResult[0];
    
    // Set default profile fields (will be null until migration is applied)
    user.bio = null;
    user.location = null;
    user.website = null;

    // Get statistics (same as public profile)
    let totalQuestions = 0;
    let totalAnswers = 0;
    let votesReceived = 0;

    try {
      const [questionStats] = await dbconnection.query(
        "SELECT COUNT(*) as totalQuestions FROM question WHERE userid = ?",
        [userid]
      );
      totalQuestions = questionStats[0]?.totalQuestions || 0;
    } catch (error) {
      console.log("[getMyProfile] Error fetching question stats:", error.message);
    }

    try {
      const [answerStats] = await dbconnection.query(
        "SELECT COUNT(*) as totalAnswers FROM answer WHERE userid = ?",
        [userid]
      );
      totalAnswers = answerStats[0]?.totalAnswers || 0;
    } catch (error) {
      console.log("[getMyProfile] Error fetching answer stats:", error.message);
    }

    try {
      const [questionVotes] = await dbconnection.query(
        `SELECT COALESCE(SUM(v.vote_type), 0) as questionVotes 
         FROM votes v 
         JOIN question q ON v.questionid = q.questionid 
         WHERE q.userid = ?`,
        [userid]
      );

      const [answerVotes] = await dbconnection.query(
        `SELECT COALESCE(SUM(v.vote_type), 0) as answerVotes 
         FROM votes v 
         JOIN answer a ON v.answerid = a.answerid 
         WHERE a.userid = ?`,
        [userid]
      );

      votesReceived = (questionVotes[0]?.questionVotes || 0) + (answerVotes[0]?.answerVotes || 0);
    } catch (voteError) {
      console.log("[getMyProfile] Votes table not found:", voteError.message);
      votesReceived = 0;
    }

    const reputation = Math.max(1, votesReceived * 10 + totalQuestions * 2 + totalAnswers * 5);

    // Get accepted answers count
    let acceptedAnswersCount = 0;
    try {
      const [acceptedAnswers] = await dbconnection.query(
        "SELECT COUNT(*) as acceptedCount FROM answer WHERE userid = ? AND is_accepted = 1",
        [userid]
      );
      acceptedAnswersCount = acceptedAnswers[0]?.acceptedCount || 0;
    } catch (error) {
      console.log("[getMyProfile] is_accepted column not found:", error.message);
      acceptedAnswersCount = 0;
    }

    const profile = {
      user: {
        ...user,
        joinedDate: user.created_at
      },
      stats: {
        totalQuestions: totalQuestions,
        totalAnswers: totalAnswers,
        reputation: reputation,
        votesReceived: votesReceived,
        acceptedAnswers: acceptedAnswersCount
      }
    };

    console.log("[getMyProfile] Profile created successfully for:", user.username);
    res.status(200).json({ msg: "My profile fetched successfully", profile });

  } catch (error) {
    console.error("[getMyProfile] Error fetching my profile:", error);
    res.status(500).json({ 
      msg: "Error fetching profile",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}

module.exports = { getUserProfile, updateUserProfile, getMyProfile };