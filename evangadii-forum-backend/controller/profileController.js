const dbconnection = require("../db/dbconfig");

// Get user profile with stats
async function getUserProfile(req, res) {
  const { userid } = req.params;
  
  if (!userid) {
    return res.status(400).json({ msg: "User ID is required" });
  }

  try {
    // Get user basic info - handle missing profile columns gracefully
    let userQuery = "SELECT userid, username, firstname, lastname, email, created_at";
    
    // Try to include profile fields if they exist
    try {
      await dbconnection.query("SELECT bio FROM users LIMIT 1");
      userQuery += ", bio, location, website";
    } catch (columnError) {
      console.log("Profile columns not found, using basic user info only");
    }
    
    userQuery += " FROM users WHERE userid = ?";
    
    const [userResult] = await dbconnection.query(userQuery, [userid]);

    if (userResult.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    const user = userResult[0];
    
    // Ensure profile fields exist (set to null if columns don't exist)
    if (!user.hasOwnProperty('bio')) {
      user.bio = null;
      user.location = null;
      user.website = null;
    }

    // Get user statistics
    const [questionStats] = await dbconnection.query(
      "SELECT COUNT(*) as totalQuestions FROM question WHERE userid = ?",
      [userid]
    );

    const [answerStats] = await dbconnection.query(
      "SELECT COUNT(*) as totalAnswers FROM answer WHERE userid = ?",
      [userid]
    );

    // Get vote statistics (votes received on user's content)
    let votesReceived = 0;
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
      console.log("Votes table not found, setting votes to 0");
      votesReceived = 0;
    }

    // Calculate basic reputation (simple formula for now)
    const reputation = Math.max(1, votesReceived * 10 + questionStats[0].totalQuestions * 2 + answerStats[0].totalAnswers * 5);

    // Get recent questions (last 5)
    const [recentQuestions] = await dbconnection.query(
      `SELECT questionid, title, created_at,
       (SELECT COUNT(*) FROM answer WHERE questionid = question.questionid) as answerCount
       FROM question 
       WHERE userid = ? 
       ORDER BY created_at DESC 
       LIMIT 5`,
      [userid]
    );

    // Get recent answers (last 5)
    const [recentAnswers] = await dbconnection.query(
      `SELECT a.answerid, a.answer, a.created_at, q.title as questionTitle, q.questionid
       FROM answer a
       JOIN question q ON a.questionid = q.questionid
       WHERE a.userid = ?
       ORDER BY a.created_at DESC
       LIMIT 5`,
      [userid]
    );

    const profile = {
      user: {
        ...user,
        joinedDate: user.created_at
      },
      stats: {
        totalQuestions: questionStats[0].totalQuestions,
        totalAnswers: answerStats[0].totalAnswers,
        reputation: reputation,
        votesReceived: votesReceived
      },
      recentActivity: {
        questions: recentQuestions,
        answers: recentAnswers
      }
    };

    res.status(200).json({ msg: "Profile fetched successfully", profile });

  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ msg: "Error fetching user profile" });
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
  
  try {
    // Get user info including private fields - handle missing profile columns gracefully
    let userQuery = "SELECT userid, username, firstname, lastname, email, created_at";
    
    // Try to include profile fields if they exist
    try {
      await dbconnection.query("SELECT bio FROM users LIMIT 1");
      userQuery += ", bio, location, website";
    } catch (columnError) {
      console.log("Profile columns not found, using basic user info only");
    }
    
    userQuery += " FROM users WHERE userid = ?";
    
    const [userResult] = await dbconnection.query(userQuery, [userid]);

    if (userResult.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    const user = userResult[0];
    
    // Ensure profile fields exist (set to null if columns don't exist)
    if (!user.hasOwnProperty('bio')) {
      user.bio = null;
      user.location = null;
      user.website = null;
    }

    // Get statistics (same as public profile)
    const [questionStats] = await dbconnection.query(
      "SELECT COUNT(*) as totalQuestions FROM question WHERE userid = ?",
      [userid]
    );

    const [answerStats] = await dbconnection.query(
      "SELECT COUNT(*) as totalAnswers FROM answer WHERE userid = ?",
      [userid]
    );

    let votesReceived = 0;
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
      votesReceived = 0;
    }

    const reputation = Math.max(1, votesReceived * 10 + questionStats[0].totalQuestions * 2 + answerStats[0].totalAnswers * 5);

    const profile = {
      user: {
        ...user,
        joinedDate: user.created_at
      },
      stats: {
        totalQuestions: questionStats[0].totalQuestions,
        totalAnswers: answerStats[0].totalAnswers,
        reputation: reputation,
        votesReceived: votesReceived
      }
    };

    res.status(200).json({ msg: "My profile fetched successfully", profile });

  } catch (error) {
    console.error("Error fetching my profile:", error);
    res.status(500).json({ msg: "Error fetching profile" });
  }
}

module.exports = { getUserProfile, updateUserProfile, getMyProfile };