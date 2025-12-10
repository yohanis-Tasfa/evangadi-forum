// express server setup
const express = require('express');
const app = express();

const port = 5500;

// import db conection
const dbconnection = require("./db/dbconfig")

// user,question,answer routes middelware files
const userRoutes = require("./routes/userRoute")
const questionRoutes = require("./routes/questionRoute")
const answerRoutes = require("./routes/answerRoute")

// json middleware to extract json data
app.use(express.json())

// user routes middelware
app.use('/api/users',userRoutes)

// question routes middelware??
app.use('/question',questionRoutes)

// avswer routes middelware??
app.use('/answer',answerRoutes)


async function start(){
    try {
        const result = await dbconnection.execute("select 'test'")
        app.listen(port)
        console.log("database connectio established")
        console.log(`listening on port ${port}`)
        // console.log(result)
    } catch (error) {
        console.log(error.message)
    }
}
start()



