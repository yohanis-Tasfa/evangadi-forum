// express server setup
const express = require("express");
const app = express();

require("dotenv").config();

const port = process.env.PORT || 5500;

const cors = require("cors");
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const isAllowedVercelPreviewOrigin = (origin) => {
  if (!origin) return false;
  try {
    const { hostname, protocol } = new URL(origin);
    if (protocol !== "https:") return false;
    if (!hostname.endsWith(".vercel.app")) return false;
    return hostname.startsWith("evangadii-forum-frontend");
  } catch {
    return false;
  }
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (isAllowedVercelPreviewOrigin(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// import db conection
const dbconnection = require("./db/dbconfig");

// user,question,answer routes middelware files
const userRoutes = require("./routes/userRoute");
const questionRoutes = require("./routes/questionRoute");
const answerRoutes = require("./routes/answerRoute");
const voteRoutes = require("./routes/voteRoute");
const profileRoutes = require("./routes/profileRoute");

// json middleware to extract json data
app.use(express.json());

// user routes middelware
app.use("/api/users", userRoutes);

// question routes middelware
app.use("/api/question", questionRoutes);

// answer routes middelware
app.use("/api/answer", answerRoutes);

// vote routes middleware
app.use("/api/vote", voteRoutes);

// profile routes middleware
app.use("/api/profile", profileRoutes);

console.log("✅ Profile routes registered at /api/profile");

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    msg: "Server is running", 
    timestamp: new Date().toISOString(),
    routes: ["users", "question", "answer", "vote", "profile"]
  });
});

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

