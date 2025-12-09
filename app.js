// express server setup
const express = require('express');
const app = express();

const port = 5500;

app.get('/',(req,res)=>{
    res.send("welcome to evangadi express")
})

// user,question,answer routes middelware files
const userRoutes = require("./routes/userRoute")
const questionRoutes = require("./routes/questionRoute")
const answerRoutes = require("./routes/answerRoute")


// user routes middelware
app.use('/api/users',userRoutes)

// question routes middelware??
app.use('/question',questionRoutes)

// avswer routes middelware??

app.use('/answer',answerRoutes)



app.listen(port,(err)=>{
    if(err){
        console.log(err.msg)
    }else{
        console.log(`server is running on port ${port}`)
    }
})
