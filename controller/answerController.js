const dbconnection = require("../db/dbconfig");
const { v4: uuidv4 } = require("uuid");

// CREATE ANSWER
async function createAnswer(req, res) {
  const { answer, questionid } = req.body;
  const userid = req.user.userid;

  if (!answer || !questionid) {
    return res.status(400).json({ msg: "Answer and questionid are required" });
  }

  const answerid = uuidv4();

  try {
    await dbconnection.query(
      "INSERT INTO answer (answerid, userid, questionid, answer) VALUES (?, ?, ?, ?)",
      [answerid, userid, questionid, answer]
    );

    res.status(201).json({ msg: "Answer added successfully", answerid });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error creating answer" });
  }
}

// function to Get all answers for a question
async function allAnswer(req, res) {
  const { questionid } = req.params;

  try {
    const [answers] = await dbconnection.query(
      "SELECT * FROM answer WHERE questionid = ?",
      [questionid]
    );

    res.status(200).json({ answers });
  } catch (error) {
    console.log(error);
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
      return res.status(404).json({ msg: "Answer not found or not owned by you" });
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
      return res.status(404).json({ msg: "Answer not found or not owned by you" });
    }

    await dbconnection.query(
      "DELETE FROM answer WHERE answerid = ?",
      [answerid]
    );

    res.status(200).json({ msg: "Answer deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error deleting answer" });
  }
}

module.exports = {createAnswer,allAnswer,specificAnswer,updateAnswer,deleteAnswer}
