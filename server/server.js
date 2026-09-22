const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const questionRoutes = require("./routes/questionRoutes");
const attemptRoutes = require("./routes/attemptRoutes");
const progressRoutes = require("./routes/progressRoutes");
const testRoutes = require("./routes/testRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/attempts", attemptRoutes); 
app.use("/api/progress", progressRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/recommendations", recommendationRoutes);

// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "PrepTrack API is running",
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});