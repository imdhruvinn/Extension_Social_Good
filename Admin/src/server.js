const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const User = require("./models/User"); // Ensure this model has fields for UID and email

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/extensionDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));

// Middleware for parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API route for fetching users with pagination
app.get("/api/users", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const users = await User.find({}, "uid email").skip(skip).limit(limit); // Fetch only UID and email
    const totalUsers = await User.countDocuments();
    res.json({ users, totalUsers });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// Serve HTML files for frontend routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", req.path));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
