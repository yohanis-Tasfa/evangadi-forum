// function  Create new question
function create(req,res){
    
    res.send("Question created successfully");
}

// function Fetch all questions
function allQuestion(req,res){
    res.send("All questions fetched successfully");
}

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