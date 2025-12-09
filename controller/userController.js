function register(req,res){
    res.send("user registered successfully")
}

function login(req,res){
    res.send("user logged in successfully")
}

function check(req,res){
    res.send("user is authenticated")
}

module.exports = {register,login,check}