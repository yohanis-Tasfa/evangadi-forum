const express = require('express');
const router = express.Router();

// register route
router.post('/register',(req,res)=>{
    res.send("user registered successfully")
})      

// login route
router.post('/login',(req,res)=>{
    res.send("user logged in successfully")
})

// check user route
router.get('/check',(req,res)=>{
    res.send("user is authenticated")
})


module.exports = router;