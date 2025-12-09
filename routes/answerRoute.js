const express = require('express');
const router = express.Router();

const {createAnswer,allAnswer,specificAnswer,updateAnswer,deleteAnswer} = require("../controller/answerController")

// Create answer
router.post('/create', createAnswer);

// Get all answers for a question
router.get('/question/:questionid',allAnswer);

// Get answers of a specific user
router.get('/user/:userid', specificAnswer);

// Update answer
router.put('/update/:answerid', updateAnswer);

// Delete answer
router.delete('/delete/:answerid', deleteAnswer);

module.exports = router;
