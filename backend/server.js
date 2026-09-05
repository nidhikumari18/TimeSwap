const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");

const { initializeSocket } = require("./socket/socket");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const swapRoutes = require("./routes/swapRoutes");
const messageRoutes = require("./routes/messageRoutes");

dotenv.config();

const app = express();

const server = http.createServer(app);

initializeSocket(server);


/* ---------------- MIDDLEWARE ---------------- */

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());


/* ---------------- ROUTES ---------------- */

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/swaps", swapRoutes);
app.use("/api/messages", messageRoutes);


/* ---------------- HOME ---------------- */

app.get("/", (req, res) => {
  res.json({
    message: "SkillSwap API is running 🚀",
  });
});


/* ---------------- DATABASE ---------------- */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(
      "MongoDB connected successfully 🌷"
    );

    server.listen(5000, () => {
      console.log(
        "SkillSwap server running on port 5000 🚀"
      );
    });
  })
  .catch((error) => {
    console.error(
      "❌ MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  });