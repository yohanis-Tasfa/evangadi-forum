const dbconnection = require("../db/dbconfig");
const { v4: uuidv4 } = require("uuid");

// CREATE ANSWER
async function createAnswer(req, res) {
  const { answer, questionid } = req.body;
  const userid = req.user.userid;

  if (!answer || !questionid) {
    return res.status(400).json({ msg: "Answer and questionid are required" });
  }

  // Validate questionid is not '0' or empty
  if (questionid === '0' || questionid === 0 || questionid === '') {
    return res.status(400).json({ msg: "Invalid question ID" });
  }

  const answerid = uuidv4();

  try {
    // First, verify that the question exists
    const [questionExists] = await dbconnection.query(
      "SELECT questionid FROM question WHERE questionid = ?",
      [questionid]
    );

    if (questionExists.length === 0) {
      return res.status(404).json({ msg: "Question not found" });
    }

    await dbconnection.query(
      "INSERT INTO answer (answerid, userid, questionid, answer) VALUES (?, ?, ?, ?)",
      [answerid, userid, questionid, answer]
    );

    res.status(201).json({ msg: "Answer added successfully", answerid });
  } catch (error) {
    console.error("Error creating answer:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
      questionid,
      userid,
      answerLength: answer?.length
    });
    
    // Check if it's a data truncation error for answerid
    if (error.code === 'WARN_DATA_TRUNCATED' && error.sqlMessage?.includes('answerid')) {
      return res.status(500).json({ 
        msg: "Database schema error: answerid column is too small. Please run the migration script to fix this.",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    res.status(500).json({ 
      msg: "Error creating answer",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// function to Get all answers for a question
async function allAnswer(req, res) {
  const { questionid } = req.params;

  try {
    // Join with users table to include username and handle is_accepted column gracefully
    let query = `SELECT a.*, u.username`;
    
    // Try to include is_accepted field if it exists
    try {
      await dbconnection.query("SELECT is_accepted FROM answer LIMIT 1");
      query += `, COALESCE(a.is_accepted, 0) as is_accepted`;
    } catch (columnError) {
      console.log("[allAnswer] is_accepted column not found, using default value 0");
      query += `, 0 as is_accepted`;
    }
    
    query += ` FROM answer a
       JOIN users u ON a.userid = u.userid
       WHERE a.questionid = ?
       ORDER BY is_accepted DESC, a.created_at DESC`;

    const [answers] = await dbconnection.query(query, [questionid]);

    console.log(`[allAnswer] Found ${answers.length} answers for question ${questionid}`);
    res.status(200).json({ answers });
  } catch (error) {
    console.log(
      "[allAnswer] Error:",
      error && error.message ? error.message : error
    );
    res.status(500).json({ msg: "Error fetching answers" });
  }
}

// GET ALL ANSWERS BY A SPECIFIC USER
async function specificAnswer(req, res) {
  const { userid } = req.params;

  try {
    const [answers] = await dbconnection.query(
      "SELECT * FROM answer WHERE userid = ?",
      [userid]
    );

    res.status(200).json({ answers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error fetching user's answers" });
  }
}

// UPDATE ANSWER
async function updateAnswer(req, res) {
  const { answerid } = req.params;
  const { answer } = req.body;
  const userid = req.user.userid;

  if (!answer) {
    return res.status(400).json({ msg: "Answer text is required" });
  }

  try {
    const [exists] = await dbconnection.query(
      "SELECT * FROM answer WHERE answerid = ? AND userid = ?",
      [answerid, userid]
    );

    if (exists.length === 0) {
      return res
        .status(404)
        .json({ msg: "Answer not found or not owned by you" });
    }

    await dbconnection.query(
      "UPDATE answer SET answer = ? WHERE answerid = ?",
      [answer, answerid]
    );

    res.status(200).json({ msg: "Answer updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error updating answer" });
  }
}

// DELETE ANSWER
async function deleteAnswer(req, res) {
  const { answerid } = req.params;
  const userid = req.user.userid;

  try {
    const [exists] = await dbconnection.query(
      "SELECT * FROM answer WHERE answerid = ? AND userid = ?",
      [answerid, userid]
    );

    if (exists.length === 0) {
      return res
        .status(404)
        .json({ msg: "Answer not found or not owned by you" });
    }

    await dbconnection.query("DELETE FROM answer WHERE answerid = ?", [
      answerid,
    ]);

    res.status(200).json({ msg: "Answer deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error deleting answer" });
  }
}

// ACCEPT ANSWER (mark as best answer)
async function acceptAnswer(req, res) {
  const { answerid } = req.params;
  const userid = req.user.userid;

  console.log("[acceptAnswer] Request to accept answer:", answerid, "by user:", userid);

  try {
    // First, get the answer and verify it exists
    const [answerResult] = await dbconnection.query(
      "SELECT a.*, q.userid as question_owner FROM answer a JOIN question q ON a.questionid = q.questionid WHERE a.answerid = ?",
      [answerid]
    );

    if (answerResult.length === 0) {
      return res.status(404).json({ msg: "Answer not found" });
    }

    const answer = answerResult[0];
    
    // Check if the current user is the question owner
    if (answer.question_owner !== userid) {
      return res.status(403).json({ msg: "Only the question owner can accept answers" });
    }

    // Check if there's already an accepted answer for this question
    const [existingAccepted] = await dbconnection.query(
      "SELECT answerid FROM answer WHERE questionid = ? AND is_accepted = 1",
      [answer.questionid]
    );

    // If there's already an accepted answer, unaccept it first
    if (existingAccepted.length > 0) {
      await dbconnection.query(
        "UPDATE answer SET is_accepted = 0 WHERE questionid = ?",
        [answer.questionid]
      );
      console.log("[acceptAnswer] Removed previous accepted answer");
    }

    // Accept the new answer
    await dbconnection.query(
      "UPDATE answer SET is_accepted = 1 WHERE answerid = ?",
      [answerid]
    );

    console.log("[acceptAnswer] Answer accepted successfully");
    res.status(200).json({ msg: "Answer accepted successfully" });

  } catch (error) {
    console.error("[acceptAnswer] Error:", error);
    
    // Handle case where is_accepted column doesn't exist
    if (error.code === 'ER_BAD_FIELD_ERROR' && error.sqlMessage?.includes('is_accepted')) {
      return res.status(400).json({ 
        msg: "Accept answer feature not available. Database needs to be updated.",
        note: "Contact administrator to run database migration for accept answer feature."
      });
    }
    
    res.status(500).json({ 
      msg: "Error accepting answer",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}

// UNACCEPT ANSWER (remove accepted status)
async function unacceptAnswer(req, res) {
  const { answerid } = req.params;
  const userid = req.user.userid;

  console.log("[unacceptAnswer] Request to unaccept answer:", answerid, "by user:", userid);

  try {
    // Get the answer and verify it exists and is accepted
    const [answerResult] = await dbconnection.query(
      "SELECT a.*, q.userid as question_owner FROM answer a JOIN question q ON a.questionid = q.questionid WHERE a.answerid = ? AND a.is_accepted = 1",
      [answerid]
    );

    if (answerResult.length === 0) {
      return res.status(404).json({ msg: "Accepted answer not found" });
    }

    const answer = answerResult[0];
    
    // Check if the current user is the question owner
    if (answer.question_owner !== userid) {
      return res.status(403).json({ msg: "Only the question owner can unaccept answers" });
    }

    // Unaccept the answer
    await dbconnection.query(
      "UPDATE answer SET is_accepted = 0 WHERE answerid = ?",
      [answerid]
    );

    console.log("[unacceptAnswer] Answer unaccepted successfully");
    res.status(200).json({ msg: "Answer unaccepted successfully" });

  } catch (error) {
    console.error("[unacceptAnswer] Error:", error);
    
    // Handle case where is_accepted column doesn't exist
    if (error.code === 'ER_BAD_FIELD_ERROR' && error.sqlMessage?.includes('is_accepted')) {
      return res.status(400).json({ 
        msg: "Accept answer feature not available. Database needs to be updated.",
        note: "Contact administrator to run database migration for accept answer feature."
      });
    }
    
    res.status(500).json({ 
      msg: "Error unaccepting answer",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}

module.exports = {
  createAnswer,
  allAnswer,
  specificAnswer,
  updateAnswer,
  deleteAnswer,
  acceptAnswer,
  unacceptAnswer,
};

