const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Job = require('../models/Job');
const Test = require('../models/Test');
const Assignment = require('../models/Assignment');
const User = require('../models/User');
const validate = require('../middleware/validate');
const schemas = require('../utils/schemas');
const Judge = require('../utils/Judge');
const Submission = require('../models/Submission');

// --- JOBS ---
router.get('/jobs', auth, async (req, res) => {
  try {
    const jobs = await Job.find().sort({ postedAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// --- TESTS ---
router.get('/tests', auth, async (req, res) => {
  try {
    const tests = await Test.find().select('-questions.correctAnswer');
    res.json(tests);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// --- ASSIGNMENTS ---
router.get('/assignments', auth, async (req, res) => {
  try {
    const assignments = await Assignment.find().populate('course', 'title');
    const user = await User.findById(req.user.id);

    const assignmentsWithStatus = assignments.map(assignment => ({
      ...assignment._doc,
      isSolved: user.solvedAssignments.some(id => id.toString() === assignment._id.toString())
    }));

    res.json(assignmentsWithStatus);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

const vm = require('vm');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

router.post('/assignments/:id/solve', [auth, validate(schemas.solve)], async (req, res) => {
  try {
    const { code, language, testcase } = req.body;
    const user = await User.findById(req.user.id);
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) return res.status(404).json({ msg: 'Assignment not found' });

    let testCasesToRun = assignment.testCases;
    let isCustomRun = false;

    if (testcase) {
      try {
        const parsedInput = JSON.parse(testcase);
        testCasesToRun = [{ input: parsedInput, expected: null, isPublic: true }];
        isCustomRun = true;
      } catch (e) {
        return res.status(400).json({ msg: 'Invalid custom testcase format' });
      }
    }

    const { success, results } = await Judge.run(code, language, testCasesToRun, isCustomRun);

    // Filter hidden test cases for non-admins
    const filteredResults = results.map(r => r.isHidden ? { ...r, input: '[HIDDEN]', expected: '[HIDDEN]', actual: '[HIDDEN]' } : r);

    // --- ONLY UPDATE STATS IF NOT A CUSTOM RUN ---
    if (!isCustomRun) {
      user.totalSubmissions += 1;
      if (success) {
        user.correctSubmissions += 1;
        if (!user.solvedAssignments.some(id => id.toString() === assignment._id.toString())) {
          user.solvedAssignments.push(assignment._id);
          user.assignmentsCompleted += 1;
          user.leaderboardPoints += (assignment.points || 10);
        }
      }
      user.accuracy = Math.round((user.correctSubmissions / user.totalSubmissions) * 100);
      await user.save();

      // Save Submission Record
      await new Submission({
        user: req.user.id,
        assignment: assignment._id,
        code,
        language,
        status: success ? 'AC' : results[0].status || 'WA',
        runtime: results[0].duration || 0
      }).save();
    }

    res.json({
      success,
      results: filteredResults,
      solvedCount: user.solvedAssignments.length,
      accuracy: user.accuracy
    });
  } catch (err) {
    console.error('Solve Error:', err);
    res.status(500).send('Server Error');
  }
});

// --- AI CODE REVIEW ---
router.post('/assignments/:id/review', auth, async (req, res) => {
  try {
    const { code, language } = req.body;
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ msg: 'Assignment not found' });

    // Simulation of AI Review (Will integrate OpenAI/Gemini in production)
    const review = {
      logic: "Your logic is sound, but consider using a hash map for O(1) lookups.",
      optimization: "Time complexity is O(N^2), try aiming for O(NlogN).",
      readability: "Good use of variable names. Consider adding comments to the helper function."
    };

    res.json({ review });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// --- AI PROGRESSIVE HINTS ---
router.post('/assignments/:id/hint', auth, async (req, res) => {
  try {
    const { level } = req.body; // 1, 2, or 3
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ msg: 'Assignment not found' });

    const hints = [
      "Think about the edge case where the array is empty.",
      "Try using a two-pointer approach to compare elements.",
      `Hint: The core logic involves sorting first. Example: \`arr.sort((a,b) => a-b)\``
    ];

    res.json({ hint: hints[level - 1] || hints[0] });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// --- AI CODE REVIEW ---
router.post('/assignments/:id/review', auth, async (req, res) => {
  try {
    const { code, language } = req.body;
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ msg: 'Assignment not found' });

    // Simulation of AI Review (Will integrate OpenAI/Gemini in production)
    const review = {
      logic: "Your logic is sound, but consider using a hash map for O(1) lookups.",
      optimization: "Time complexity is O(N^2), try aiming for O(NlogN).",
      readability: "Good use of variable names. Consider adding comments to the helper function."
    };

    res.json({ review });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// --- AI PROGRESSIVE HINTS ---
router.post('/assignments/:id/hint', auth, async (req, res) => {
  try {
    const { level } = req.body; // 1, 2, or 3
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ msg: 'Assignment not found' });

    const hints = [
      "Think about the edge case where the array is empty.",
      "Try using a two-pointer approach to compare elements.",
      `Hint: The core logic involves sorting first. Example: \`arr.sort((a,b) => a-b)\``
    ];

    res.json({ hint: hints[level - 1] || hints[0] });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// --- BOOKMARKS ---
router.get('/bookmarks', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('bookmarks.item');
    res.json(user.bookmarks);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.post('/bookmarks', auth, async (req, res) => {
  try {
    const { type, itemId } = req.body;
    const user = await User.findById(req.user.id);

    // Check if already bookmarked
    const exists = user.bookmarks.find(b => b.item.toString() === itemId);
    if (exists) {
      user.bookmarks = user.bookmarks.filter(b => b.item.toString() !== itemId);
    } else {
      user.bookmarks.push({ type, item: itemId });
    }

    await user.save();
    res.json(user.bookmarks);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// --- SEARCH ---
router.get('/search', auth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ courses: [], companies: [], jobs: [] });

    const Company = require('../models/Company');
    const Course = require('../models/Course');
    const Job = require('../models/Job');

    const [companies, courses, jobs] = await Promise.all([
      Company.find({ name: { $regex: q, $options: 'i' } }).limit(5),
      Course.find({ title: { $regex: q, $options: 'i' } }).limit(5),
      Job.find({ title: { $regex: q, $options: 'i' } }).limit(5)
    ]);

    res.json({ companies, courses, jobs });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// --- AI EXPLAIN MY CODE ---
router.post('/assignments/:id/explain', auth, async (req, res) => {
  try {
    const { code } = req.body;

    // Simulation of AI Explanation (Production: OpenAI GPT-4o)
    const explanation = [
      "The code begins by identifying the input structure and preparing the result set.",
      "A loop is used to process each element individually, ensuring O(N) efficiency.",
      "The conditional logic separates valid data points from outliers.",
      "Finally, the aggregated results are returned in the requested format."
    ];

    res.json({ explanation });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
