const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema({
 uid: { type: String, required: true ,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Prevent duplicates
    lowercase: true, // Store emails in lowercase
    trim: true,
    match: [
      /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
      "Please provide a valid email address",
    ],
  },
  phone: {
    type: String,
    match: [/^\d{10}$/, "Please provide a valid 10-digit phone number"],
    required: true,
  },
  emotionPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
