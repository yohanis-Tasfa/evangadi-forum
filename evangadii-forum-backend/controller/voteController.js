const dbconnection = require("../db/dbconfig");

// Vote on a question
async function voteQuestion(req, res) {
  const { questionid } = req.params;
  const { vote_type } = req.body; // 1 for upvote, -1 for downvote
  const userid = req.user.userid;

  if (![1, -1].includes(vote_type)) {
    return res.status(400).json({ msg: "Invalid vote type" });
  }

  try {
    // Check if user already voted
    const [existing] = await dbconnection.query(
      "SELECT * FROM votes WHERE userid = ? AND questionid = ?",
      [userid, questionid]
    );

    if (existing.length > 0) {
      if (existing[0].vote_type === vote_type) {
        // Remove vote (toggle off)
        await dbconnection.query(
          "DELETE FROM votes WHERE userid = ? AND questionid = ?",
          [userid, questionid]
        );
        return res.status(200).json({ msg: "Vote removed", action: "removed" });
      } else {
        // Change vote
        await dbconnection.query(
          "UPDATE votes SET vote_type = ? WHERE userid = ? AND questionid = ?",
          [vote_type, userid, questionid]
        );
        return res.status(200).json({ msg: "Vote changed", action: "changed" });
      }
    }

    // New vote
    await dbconnection.query(
      "INSERT INTO votes (userid, questionid, vote_type) VALUES (?, ?, ?)",
      [userid, questionid, vote_type]
    );

    res.status(201).json({ msg: "Vote recorded", action: "added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error recording vote" });
  }
}

// Vote on an answer
async function voteAnswer(req, res) {
  const { answerid } = req.params;
  const { vote_type } = req.body;
  const userid = req.user.userid;

  if (![1, -1].includes(vote_type)) {
    return res.status(400).json({ msg: "Invalid vote type" });
  }

  try {
    const [existing] = await dbconnection.query(
      "SELECT * FROM votes WHERE userid = ? AND answerid = ?",
      [userid, answerid]
    );

    if (existing.length > 0) {
      if (existing[0].vote_type === vote_type) {
        await dbconnection.query(
          "DELETE FROM votes WHERE userid = ? AND answerid = ?",
          [userid, answerid]
        );
        return res.status(200).json({ msg: "Vote removed", action: "removed" });
      } else {
        await dbconnection.query(
          "UPDATE votes SET vote_type = ? WHERE userid = ? AND answerid = ?",
          [vote_type, userid, answerid]
        );
        return res.status(200).json({ msg: "Vote changed", action: "changed" });
      }
    }

    await dbconnection.query(
      "INSERT INTO votes (userid, answerid, vote_type) VALUES (?, ?, ?)",
      [userid, answerid, vote_type]
    );

    res.status(201).json({ msg: "Vote recorded", action: "added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error recording vote" });
  }
}

// Get vote counts for a question
async function getQuestionVotes(req, res) {
  const { questionid } = req.params;
  const userid = req.user?.userid;

  try {
    const [votes] = await dbconnection.query(
      "SELECT COALESCE(SUM(vote_type), 0) as voteCount FROM votes WHERE questionid = ?",
      [questionid]
    );

    let userVote = 0;
    if (userid) {
      const [userVoteResult] = await dbconnection.query(
        "SELECT vote_type FROM votes WHERE userid = ? AND questionid = ?",
        [userid, questionid]
      );
      if (userVoteResult.length > 0) {
        userVote = userVoteResult[0].vote_type;
      }
    }

    res.status(200).json({
      voteCount: Number(votes[0].voteCount),
      userVote
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error fetching votes" });
  }
}

// Get vote counts for an answer
async function getAnswerVotes(req, res) {
  const { answerid } = req.params;
  const userid = req.user?.userid;

  try {
    const [votes] = await dbconnection.query(
      "SELECT COALESCE(SUM(vote_type), 0) as voteCount FROM votes WHERE answerid = ?",
      [answerid]
    );

    let userVote = 0;
    if (userid) {
      const [userVoteResult] = await dbconnection.query(
        "SELECT vote_type FROM votes WHERE userid = ? AND answerid = ?",
        [userid, answerid]
      );
      if (userVoteResult.length > 0) {
        userVote = userVoteResult[0].vote_type;
      }
    }

    res.status(200).json({
      voteCount: Number(votes[0].voteCount),
      userVote
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error fetching votes" });
  }
}

module.exports = { voteQuestion, voteAnswer, getQuestionVotes, getAnswerVotes };
