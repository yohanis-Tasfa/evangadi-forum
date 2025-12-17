// express server setup
const express = require("express");
const app = express();

require("dotenv").config();

const port = process.env.PORT || 5500;

const cors = require("cors");
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

// import db conection
const dbconnection = require("./db/dbconfig");

// user,question,answer routes middelware files
const userRoutes = require("./routes/userRoute");
const questionRoutes = require("./routes/questionRoute");
const answerRoutes = require("./routes/answerRoute");

// json middleware to extract json data
app.use(express.json());

// user routes middelware
app.use("/api/users", userRoutes);

// question routes middelware
app.use("/api/question", questionRoutes);

// answer routes middelware
app.use("/api/answer", answerRoutes);

async function start() {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`);
  });

  try {
    const result = await dbconnection.execute("select 'test'");
    console.log("database connection established");
  } catch (error) {
    console.log("database connection failed:", error && error.message ? error.message : error);
  }
}
start();

process.on("unhandledRejection", (reason) => {
  console.log(
    "unhandledRejection:",
    reason && reason.message ? reason.message : reason
  );
});

process.on("uncaughtException", (err) => {
  console.log("uncaughtException:", err && err.message ? err.message : err);
});

