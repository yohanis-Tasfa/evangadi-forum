// function create answer 

function createAnswer(req,res){
    
    res.send("Answer added successfully");
}

// function to Get all answers for a question

function allAnswer(req,res) {
    const { questionid } = req.params;
    res.send(`Answers for question ${questionid} fetched successfully`);
}

// Get answers of a specific user

function specificAnswer(req,res) {
    const { userid } = req.params;
    res.send(`Answers by user ${userid} fetched successfully`);
}

// Update answer
function updateAnswer(req,res) {
    const { answerid } = req.params;
    res.send(`Answer ${answerid} updated successfully`);
}

// Delete answer
function deleteAnswer(req,res) {
    const { answerid } = req.params;
    res.send(`Answer ${answerid} deleted successfully`);
}

module.exports = {createAnswer,allAnswer,specificAnswer,updateAnswer,deleteAnswer}
