const express = require('express');
const router = express.Router();

// Create answer
router.post('/create', (req, res) => {
    // req.body: { userid, questionid, answer }
    res.send("Answer added successfully");
});

// Get all answers for a question
router.get('/question/:questionid', (req, res) => {
    const { questionid } = req.params;
    res.send(`Answers for question ${questionid} fetched successfully`);
});

// Get answers of a specific user
router.get('/user/:userid', (req, res) => {
    const { userid } = req.params;
    res.send(`Answers by user ${userid} fetched successfully`);
});

// Update answer
router.put('/update/:answerid', (req, res) => {
    const { answerid } = req.params;
    res.send(`Answer ${answerid} updated successfully`);
});

// Delete answer
router.delete('/delete/:answerid', (req, res) => {
    const { answerid } = req.params;
    res.send(`Answer ${answerid} deleted successfully`);
});

module.exports = router;
