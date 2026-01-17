const express = require('express');
const router = express.Router();
const authmiddleware = require("../middleware/authmiddleware");
const { getUserProfile, updateUserProfile, getMyProfile } = require("../controller/profileController");

// Test endpoint to verify profile routes are working
router.get('/test', (req, res) => {
  res.status(200).json({ msg: "Profile routes are working", timestamp: new Date().toISOString() });
});

// Get current user's profile (private)
router.get('/me', authmiddleware, getMyProfile);

// Get any user's public profile
router.get('/:userid', getUserProfile);

// Update current user's profile
router.put('/me', authmiddleware, updateUserProfile);

module.exports = router;