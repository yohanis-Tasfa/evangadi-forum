const express = require('express');
const router = express.Router();

// import auth middleware
const authmiddleware = require("../middleware/authmiddleware")

// import functions
const {create,allQuestion,questionById,questionByUser,updateQuestion,deleteQuestion} = require("../controller/questionController")

// Create new question
router.post('/create',authmiddleware,create);

// Fetch all questions
router.get('/all', authmiddleware,allQuestion);

// Fetch a question by questionid
router.get('/:questionid',authmiddleware,questionById);

// Fetch all questions posted by a specific user
router.get('/user/:userid', authmiddleware,questionByUser);

// Update question
router.put('/update/:questionid', authmiddleware,updateQuestion);

// Delete question
router.delete('/delete/:questionid', authmiddleware,deleteQuestion);

module.exports = router;

