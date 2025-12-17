const express = require("express");
const router = express.Router();

// import auth middleware
const authmiddleware = require("../middleware/authmiddleware");

const {
  createAnswer,
  allAnswer,
  specificAnswer,
  updateAnswer,
  deleteAnswer,
} = require("../controller/answerController");

// Create answer
router.post("/create", authmiddleware, createAnswer);

// Get all answers for a question
router.get("/question/:questionid", authmiddleware, allAnswer);

// Get answers of a specific user
router.get("/user/:userid", authmiddleware, specificAnswer);

// Update answer
router.put("/update/:answerid", authmiddleware, updateAnswer);

// Delete answer
router.delete("/delete/:answerid", authmiddleware, deleteAnswer);

module.exports = router;

