const User = require("../models/userModel");

// Controller to retrieve user information by UID
exports.getUserInfoByUID = async (req, res) => {
  try {
    const { uid } = req.params; // Get UID from the route parameters
    const user = await User.findOne({ uid }); // Query the user by UID

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user); // If found, return user data
  } catch (err) {
    console.error("Error retrieving user information from MongoDB:", err);
    res.status(500).json({
      message: "Error retrieving user information from MongoDB",
      error: err.message,
    });
  }
};

// Controller to save or update user information by UID
exports.saveUserInfo = async (req, res) => {
  const { email, phone, uid } = req.body; // Receive UID from the frontend

  // Validate required fields
  if (!email || !phone || !uid) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Check if a user with the same UID already exists
    let user = await User.findOne({ uid });

    if (user) {
      // If a user with the same UID exists, update the email and phone
      user.email = email;
      user.phone = phone;
      await user.save();
      console.log("User information updated successfully:", user);
      return res.status(200).json({
        message: "User information updated successfully",
        uid: user.uid,
      });
    }

    // If no user with the same UID exists, create a new user entry
    user = new User({ email, phone, uid });
    await user.save();

    console.log("New user created successfully:", user);
    res
      .status(201)
      .json({ message: "User created successfully", uid: user.uid });
  } catch (err) {
    console.error("Error saving user information to MongoDB:", err);
    res.status(500).json({
      message: "Error saving user information to MongoDB",
      error: err.message,
    });
  }
};

// Controller to save or update cookie consent by UID
exports.updateCookieConsent = async (req, res) => {
  const { consent, uid } = req.body; // Receive UID from the frontend

  if (!consent || !uid) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cookieConsent = consent;
    await user.save();

    console.log("Cookie consent updated successfully for user:", user);
    res.status(200).json({ message: "Cookie consent updated successfully" });
  } catch (err) {
    console.error("Error updating cookie consent in MongoDB:", err);
    res.status(500).json({
      message: "Error updating cookie consent in MongoDB",
      error: err.message,
    });
  }
};

// Utility function to generate a new UID (if needed for future use)
function generateUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
