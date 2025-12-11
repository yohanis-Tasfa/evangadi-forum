// function  Create new question
const { v4: uuidv4 } = require("uuid");
// import db connection
// const dbconnection = require("../db/dbconfig");


// // CREATE QUESTION
// async function create(req, res) {
//   const { title, description, tag } = req.body;
//   const userid = req.user.userid;

//   if (!title || !description) {
//     return res.status(400).json({ msg: "Title and description required" });
//   }

//   const questionid = uuidv4(); // create unique ID

//   try {
//     await dbconnection.query(
//       "INSERT INTO question (questionid, userid, title, description, tag) VALUES (?, ?, ?, ?, ?)",
//       [questionid, userid, title, description, tag]
//     );

//     res.status(201).json({ msg: "Question created", questionid });
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ msg: "Error creating question" });
//   }
// }


// // function Fetch all questions
// async function allQuestion(req, res) {
//   try {
//     const [rows] = await dbconnection.query(
//       "SELECT * FROM question ORDER BY questionid "
//     );
//     res.status(200).json({ msg: "All questions fetched", data: rows });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ msg: "Error fetching questions" });
//   }
// }


// function Fetch a question by questionid
function questionById(req,res){
    const { questionid } = req.params;
    res.send(`Question ${questionid} fetched successfully`);
}

// function Fetch all questions posted by a specific user
function questionByUser(req,res){
    const { userid } = req.params;
    res.send(`Questions for user ${userid} fetched successfully`);
}

//function Update question
function updateQuestion(req,res){
    const { questionid } = req.params;
    res.send(`Question ${questionid} updated successfully`);
}

//function Delete question
function deleteQuestion(req,res){
    const { questionid } = req.params;
    res.send(`Question ${questionid} deleted successfully`);
}

// export functions
module.exports = {create,allQuestion,questionById,questionByUser,updateQuestion,deleteQuestion}