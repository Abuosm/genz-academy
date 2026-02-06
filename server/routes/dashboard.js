const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   GET api/dashboard/leaderboard
// @desc    Get top 3 users by leaderboardPoints
// @access  Private
router.get('/leaderboard', auth, async (req, res) => {
  try {
    // Find top 3 users with highest points
    const users = await User.find()
      .sort({ leaderboardPoints: -1 })
      .limit(3)
      .select('name leaderboardPoints profileImage');

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/dashboard/comprehensive-stats
// @desc    Get comprehensive dashboard statistics
// @access  Private
router.get('/comprehensive-stats', auth, async (req, res) => {
  console.log('📊 Dashboard stats requested by user:', req.user.id);
  try {
    const User = require('../models/User');
    const Company = require('../models/Company');
    const Course = require('../models/Course');
    console.log('✅ Models loaded successfully');

    // Get user data (don't populate yet to avoid errors)
    const user = await User.findById(req.user.id);
    console.log('✅ User found:', user ? user.name : 'NOT FOUND');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Initialize default values
    let totalQuestions = 0;
    let totalCompanies = 0;
    let totalCourses = 0;
    let totalRounds = 0;
    let favoriteCompaniesCount = 0;

    // Try to get companies data
    try {
      const companies = await Company.find();
      totalCompanies = companies.length;

      // Calculate total questions and rounds
      totalQuestions = companies.reduce((total, company) => {
        if (!company.interviewRounds) return total;
        const questionsInCompany = company.interviewRounds.reduce((roundTotal, round) => {
          return roundTotal + (round.questions ? round.questions.length : 0);
        }, 0);
        return total + questionsInCompany;
      }, 0);

      totalRounds = companies.reduce((total, company) => {
        return total + (company.interviewRounds ? company.interviewRounds.length : 0);
      }, 0);
    } catch (companyErr) {
      console.error('Error fetching companies:', companyErr.message);
    }

    // Try to get favorite companies count
    try {
      favoriteCompaniesCount = user.favoriteCompanies ? user.favoriteCompanies.length : 0;
    } catch (favErr) {
      console.error('Error counting favorites:', favErr.message);
    }

    // Try to get courses count
    try {
      totalCourses = await Course.countDocuments();
    } catch (courseErr) {
      console.error('Error counting courses:', courseErr.message);
    }

    // Get leaderboard
    let allUsers = [];
    let userRank = 1;
    try {
      allUsers = await User.find().sort({ leaderboardPoints: -1 }).select('name leaderboardPoints');
      userRank = allUsers.findIndex(u => u._id.toString() === req.user.id) + 1;
      if (userRank === 0) userRank = 1; // If not found, default to rank 1
    } catch (leaderboardErr) {
      console.error('Error fetching leaderboard:', leaderboardErr.message);
      allUsers = [user]; // Just show current user
    }

    // Get solved assignments breakdown
    let solvedStats = {
      Easy: 0,
      Medium: 0,
      Hard: 0,
      total: 0
    };

    try {
      if (user.solvedAssignments && user.solvedAssignments.length > 0) {
        const Assignment = require('../models/Assignment');
        const solvedItems = await Assignment.find({ _id: { $in: user.solvedAssignments } });

        solvedItems.forEach(item => {
          if (solvedStats[item.difficulty] !== undefined) {
            solvedStats[item.difficulty]++;
          }
        });
        solvedStats.total = solvedItems.length;
      }
    } catch (solvedErr) {
      console.error('Error fetching solved stats:', solvedErr.message);
    }

    res.json({
      user: {
        name: user.name || 'User',
        email: user.email,
        employabilityScore: user.employabilityScore || 35,
        leaderboardPoints: user.leaderboardPoints || 100,
        rank: userRank,
        assignmentsCompleted: solvedStats.total,
        accuracy: user.accuracy || 0,
        solvedStats
      },
      stats: {
        totalQuestions,
        totalCompanies,
        totalCourses,
        favoriteCompanies: favoriteCompaniesCount,
        totalRounds
      },
      leaderboard: allUsers.slice(0, 10).map((u, index) => ({
        rank: index + 1,
        name: u.name || 'Anonymous',
        points: u.leaderboardPoints || 0,
        isCurrentUser: u._id.toString() === req.user.id
      }))
    });
  } catch (err) {
    console.error('Dashboard stats error:', err.message);
    console.error(err.stack);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

module.exports = router;
