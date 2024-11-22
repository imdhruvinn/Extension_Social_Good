const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Fetch users from the database
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

module.exports = router;