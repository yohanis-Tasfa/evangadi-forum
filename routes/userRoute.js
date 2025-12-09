const express = require('express');
const router = express.Router();

const {register,login,check} = require("../controller/userController")

// register route
router.post('/register',register)      

// login route
router.post('/login',login)

// check user route
router.get('/check',check)


module.exports = router;