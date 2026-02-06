const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const User = require('../models/User');
const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');

// @route   GET api/admin/stats
// @desc    Get platform-wide statistics
// @access  Admin
router.get('/stats', [auth, admin], async (req, res) => {
  try {
    const [userCount, submissionCount, assignmentCount] = await Promise.all([
      User.countDocuments(),
      Submission.countDocuments(),
      Assignment.countDocuments()
    ]);
    res.json({ userCount, submissionCount, assignmentCount });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET api/admin/users
// @desc    Get all users
// @access  Admin
router.get('/users', [auth, admin], async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ date: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST api/admin/users/:id/role
// @desc    Change user role
// @access  Admin
router.post('/users/:id/role', [auth, admin], async (req, res) => {
  try {
    const { role } = req.body;
    await User.findByIdAndUpdate(req.params.id, { role });
    res.json({ msg: `User role updated to ${role}` });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
