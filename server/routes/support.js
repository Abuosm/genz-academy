const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Issue = require('../models/Issue');

// @route   POST api/support/report
// @desc    Report an issue
// @access  Private
router.post('/report', auth, async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    const newIssue = new Issue({
      user: req.user.id,
      title,
      description,
      category,
      priority
    });

    const issue = await newIssue.save();
    res.json(issue);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/support/issues
// @desc    Get all issues reported by user
// @access  Private
router.get('/issues', auth, async (req, res) => {
  try {
    const issues = await Issue.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(issues);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

const validate = require('../middleware/validate');
const schemas = require('../utils/schemas');
const User = require('../models/User');

// @route   POST api/support/ask
// @desc    Handle chatbot queries with smart data integration
// @access  Private
router.post('/ask', [auth, validate(schemas.chat)], async (req, res) => {
  try {
    const { message } = req.body;
    const lowerMsg = message.toLowerCase();

    // Fetch User Data for personalization
    const user = await User.findById(req.user.id);
    const allUsers = await User.find().sort({ leaderboardPoints: -1 });
    const userRank = allUsers.findIndex(u => u._id.toString() === req.user.id) + 1;

    // Fetch Platform Metadata
    const Assignment = require('../models/Assignment');
    const Course = require('../models/Course');
    const Job = require('../models/Job');
    const Company = require('../models/Company');

    const [totalTasks, totalCourses, totalJobs, totalCompanies] = await Promise.all([
      Assignment.countDocuments(),
      Course.countDocuments(),
      Job.countDocuments(),
      Company.countDocuments()
    ]);

    let response = "";

    // Comprehensive Smart Logic
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
      response = `Hello ${user.name || 'Student'}! I'm GenZ AI, your personal growth accelerator. How can I help you dominate your career goals today?`;
    }
    else if (lowerMsg.includes('rank') || lowerMsg.includes('my position') || lowerMsg.includes('leaderboard')) {
      response = `You are currently ranked #${userRank} globally with ${user.leaderboardPoints || 0} points. You've solved ${user.assignmentsCompleted || 0} challenges with ${user.accuracy || 0}% accuracy. Keep pushing!`;
    }
    else if (lowerMsg.includes('accuracy') || lowerMsg.includes('performance')) {
      response = `Your current problem-solving accuracy is ${user.accuracy || 0}%. You have completed ${user.correctSubmissions || 0} out of ${user.totalSubmissions || 0} total submissions. Try targetting "Medium" difficulty tasks to boost your score!`;
    }
    else if (lowerMsg.includes('course') || lowerMsg.includes('learn')) {
      response = `We have ${totalCourses} industrial-grade courses available right now. Your last progress was impressive! Head over to the 'Courses' section to continue your journey.`;
    }
    else if (lowerMsg.includes('job') || lowerMsg.includes('career') || lowerMsg.includes('hiring')) {
      response = `There are ${totalJobs} active job openings from top companies like Google and Zeta. Check the 'Jobs' section for opportunities matching your profile!`;
    }
    else if (lowerMsg.includes('company') || lowerMsg.includes('interview')) {
      response = `I have guides for ${totalCompanies} major tech firms. Each guide includes real interview questions and salary insights. Which company are you aiming for?`;
    }
    else if (lowerMsg.includes('assignment') || lowerMsg.includes('problem') || lowerMsg.includes('task')) {
      response = `You've conquered ${user.assignmentsCompleted} out of ${totalTasks} elite coding challenges. Head to the 'Problem Solving' workbench to smash more!`;
    }
    else if (lowerMsg.includes('thank') || lowerMsg.includes('thanks')) {
      response = "You're very welcome! I'm here to ensure you win. Anything else on your mind?";
    }
    else {
      response = `That's an interesting question! While I'm specialized in your GenZ Academy data (like your rank #${userRank} or your ${user.accuracy}% accuracy), I'm still learning broader topics. Try asking about your progress, courses, or interview prep!`;
    }

    res.json({ response });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
