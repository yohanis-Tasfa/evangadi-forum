// express server setup
const express = require('express');
const app = express();

const port = 5500;



// register route

app.post('/api/users/register',(req,res)=>{
    res.send("user registered successfully")
})

// login route

app.post('/api/users/login',(req,res)=>{
    res.send("user logged in successfully")
})

// check user route

app.get('/api/users/check',(req,res)=>{
    res.send("user is authenticated")
})


app.listen(port,(err)=>{
    if(err){
        console.log(err.msg)
    }else{
        console.log(`server is running on port ${port}`)
    }
})
