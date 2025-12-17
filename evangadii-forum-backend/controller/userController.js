// import db conection
const dbconnection = require("../db/dbconfig");

// import bcrypt after install
const bcrypt = require("bcrypt");
// import token
const jwt = require("jsonwebtoken");

// REGISTER
async function register(req, res) {
  const { username, firstname, lastname, email, password } = req.body;
  if (!email || !password || !firstname || !lastname || !username) {
    return res.status(400).json({ msg: "please provide all requiered field" });
  }

  try {
    const [user] = await dbconnection.query(
      "select username,userid from users where username =? or email=?",
      [username, email]
    );
    if (user.length > 0) {
      return res.status(401).json({ msg: "user already existed" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ msg: "password must be at least 8 character" });
    }

    // encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // insert data to db
    await dbconnection.query(
      "INSERT INTO users (username,firstname,lastname,email,password) VALUES (?,?,?,?,?)",
      [username, firstname, lastname, email, hashedPassword]
    );
    return res.status(201).json({ msg: "user registered successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: "something went wrong try again!" });
  }
}

// LOGIN
async function login(req, res) {
  const { email, password } = req.body || {};
  console.log("[login] body:", req.body);
  if (!email || !password) {
    return res.status(400).json({ msg: "please enter all required filled" });
  }

  try {
    // fetch user data using email if useer exist
    const [user] = await dbconnection.query(
      "select username,userid,password from users where email=?",
      [email]
    );
    if (user.length == 0) {
      console.log("[login] no user found for email:", email);
      return res.status(400).json({ msg: "invalid credential" });
    }
    // return res.json({user}) // return user

    // compare password
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(400).json({ msg: "invalid credential" });
    }
    // return res.json({user:user[0].password}) // return password only

    // token part

    const username = user[0].username;
    const userid = user[0].userid;
    const token = jwt.sign({ username, userid }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({ msg: "user login successfully", token });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: "something went wrong try again!" });
  }
}

// CHECK USER

async function check(req, res) {
  const userid = req.user.userid;

  try {
    const [rows] = await dbconnection.query(
      "SELECT username, firstname, userid FROM users WHERE userid = ?",
      [userid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ msg: "user not found" });
    }

    const { username, firstname } = rows[0];

    res.status(200).json({ msg: "valid user", username, firstname, userid });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "something went wrong try again!" });
  }
}

module.exports = { register, login, check };

