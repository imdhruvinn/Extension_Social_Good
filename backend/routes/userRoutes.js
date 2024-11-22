const express = require("express");
const router = express.Router(); // Define the router to handle routes
const userController = require("../controllers/userController"); // Import the userController

// Define the POST route to save new user information
router.post("/user-info", userController.saveUserInfo);

// Define the GET route to retrieve user information by UID (if needed)
router.get("/user-info/:uid", userController.getUserInfoByUID); // Make sure you have this function in the controller

module.exports = router;
