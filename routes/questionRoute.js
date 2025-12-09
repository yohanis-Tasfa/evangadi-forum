const express = require('express');
const router = express.Router();

const {create,allQuestion,questionById,questionByUser,updateQuestion,deleteQuestion} = require("../controller/questionController")

// Create new question
router.post('/create', create);

// Fetch all questions
router.get('/all', allQuestion);

// Fetch a question by questionid
router.get('/:questionid',questionById);

// Fetch all questions posted by a specific user
router.get('/user/:userid', questionByUser);

// Update question
router.put('/update/:questionid', updateQuestion);

// Delete question
router.delete('/delete/:questionid', deleteQuestion);

module.exports = router;
