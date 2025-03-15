const express = require("express");
const userController = require("../controllers/userController");
const isAuthenticated  = require("../middleware/isAuthenticated");
const upload = require("../utils/multer");


const router = express.Router();

// Register
router.post("/register", userController.register);

// Login 
router.post("/login", userController.login);

// Logout
router.get("/logout", userController.logout);

// Get User Profile
router.get("/profile", isAuthenticated, userController.getUserProfile);

// Update Profile
router.put("/profile/update", isAuthenticated, upload.single("profilePhoto"), userController.updateProfile);

module.exports = router;