// import db conection
const dbconnection = require("../db/dbconfig")

// import bcrypt after install
const bcrypt = require("bcrypt")


async function register(req,res){
    const {username,firstname,lastname,email,password} =req.body;
    if (!email || !password || !firstname || !lastname || !username) {
        return res.status(400).json({msg:"please provide all requiered field"})
    }

    try {
        const [user] = await dbconnection.query("select username,userid from users where username =? or email=?",[username,email])
        if(user.length>0) {
            return res.status(401).json({msg:"user already existed"})
        }

        if(password.length<8){
            return res.status(400).json({msg:"password must be at least 8 character"})
        }

        // encrypt password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
         
        // insert data to db
        await dbconnection.query("INSERT INTO users (username,firstname,lastname,email,password) VALUES (?,?,?,?,?)",[username,firstname,lastname,email,hashedPassword])
        return res.status(201).json({msg:"user registered successfully"})

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({msg:"something went wrong try again!"})
    }
}

async function login(req,res){
    res.send("user logged in successfully")
}

async function check(req,res){
    res.send("user is authenticated")
}

module.exports = {register,login,check}