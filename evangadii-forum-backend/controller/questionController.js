// function  Create new question
const { v4: uuidv4 } = require("uuid");
// import db connection
const dbconnection = require("../db/dbconfig");

// CREATE QUESTION
async function create(req, res) {
  const { title, description, tag } = req.body;
  const userid = req.user.userid;

  if (!title || !description) {
    return res.status(400).json({ msg: "Title and description required" });
  }

  const questionid = uuidv4(); // create unique ID

  try {
    await dbconnection.query(
      "INSERT INTO question (questionid, userid, title, description, tag) VALUES (?, ?, ?, ?, ?)",
      [questionid, userid, title, description, tag]
    );

    res.status(201).json({ msg: "Question created", questionid });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Error creating question" });
  }
}

// function Fetch all questions
async function allQuestion(req, res) {
  try {
    // Join question with the user table to get the username
    const [rows] = await dbconnection.query(
      `SELECT q.*, u.username FROM question q 
      JOIN users u ON q.userid = u.userid
      ORDER BY q.id DESC`
    );

    res.status(200).json({ msg: "All questions fetched", data: rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error fetching questions" });
  }
}

// function Fetch a question by questionid
async function questionById(req, res) {
  const { questionid } = req.params;

  try {
    const [rows] = await dbconnection.query(
      "SELECT * FROM question WHERE questionid = ?",
      [questionid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ msg: "Question not found" });
    }

    res.status(200).json({ msg: "Question fetched", data: rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error fetching question" });
  }
}

// function Fetch all questions posted by a specific user
async function questionByUser(req, res) {
  const { userid } = req.params;

  try {
    const [rows] = await dbconnection.query(
      "SELECT * FROM question WHERE userid = ? ORDER BY id DESC",
      [userid]
    );

    res.status(200).json({
      msg: `Questions for user ${userid}`,
      data: rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error fetching user questions" });
  }
}

//function Update question
async function updateQuestion(req, res) {
  const { questionid } = req.params;
  const { title, description, tag } = req.body;
  const userid = req.user.userid; // only owner can update

  try {
    const [exists] = await dbconnection.query(
      "SELECT * FROM question WHERE questionid = ? AND userid = ? ",
      [questionid, userid]
    );

    if (exists.length === 0) {
      return res.status(404).json({
        msg: "Question not found or you are not the owner",
      });
    }

    await dbconnection.query(
      "UPDATE question SET title = ?, description = ?, tag = ? WHERE questionid = ?",
      [title, description, tag, questionid]
    );

    res.status(200).json({ msg: "Question updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error updating question" });
  }
}

//function Delete question
async function deleteQuestion(req, res) {
  const { questionid } = req.params;
  const userid = req.user.userid; // only owner can delete

  try {
    const [exists] = await dbconnection.query(
      "SELECT * FROM question WHERE questionid = ? AND userid = ?",
      [questionid, userid]
    );

    if (exists.length === 0) {
      return res.status(404).json({
        msg: "Question not found or you are not the owner",
      });
    }

    await dbconnection.query("DELETE FROM question WHERE questionid = ?", [
      questionid,
    ]);

    res.status(200).json({ msg: "Question deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error deleting question" });
  }
}

// export functions
module.exports = {
  create,
  allQuestion,
  questionById,
  questionByUser,
  updateQuestion,
  deleteQuestion,
};

