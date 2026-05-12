const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Get all users (for assigning tasks / adding to projects)
router.get('/', protect, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
