const express = require('express');
const router = express.Router();
const authmiddleware = require("../middleware/authmiddleware");
const { voteQuestion, voteAnswer, getQuestionVotes, getAnswerVotes } = require("../controller/voteController");

// Vote on question
router.post('/question/:questionid', authmiddleware, voteQuestion);

// Vote on answer
router.post('/answer/:answerid', authmiddleware, voteAnswer);

// Get question votes
router.get('/question/:questionid', authmiddleware, getQuestionVotes);

// Get answer votes
router.get('/answer/:answerid', authmiddleware, getAnswerVotes);

module.exports = router;
