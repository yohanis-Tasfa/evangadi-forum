const express = require('express');
const router = express.Router();

// Create new question
router.post('/create', (req, res) => {
    
    res.send("Question created successfully");
});

// Fetch all questions
router.get('/all', (req, res) => {
    res.send("All questions fetched successfully");
});

// Fetch a question by questionid
router.get('/:questionid', (req, res) => {
    const { questionid } = req.params;
    res.send(`Question ${questionid} fetched successfully`);
});

// Fetch all questions posted by a specific user
router.get('/user/:userid', (req, res) => {
    const { userid } = req.params;
    res.send(`Questions for user ${userid} fetched successfully`);
});

// Update question
router.put('/update/:questionid', (req, res) => {
    const { questionid } = req.params;
    res.send(`Question ${questionid} updated successfully`);
});

// Delete question
router.delete('/delete/:questionid', (req, res) => {
    const { questionid } = req.params;
    res.send(`Question ${questionid} deleted successfully`);
});

module.exports = router;
