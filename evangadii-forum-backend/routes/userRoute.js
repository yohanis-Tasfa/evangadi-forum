const express = require('express');
const router = express.Router();
// import auth middleware

const authmiddleware = require("../middleware/authmiddleware")

const {register,login,check} = require("../controller/userController")



// register route
router.post('/register',register)      

// login route
router.post('/login',login)

// check user route
router.get('/check',authmiddleware,check)


module.exports = router;

