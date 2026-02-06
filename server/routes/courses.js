const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const auth = require('../middleware/auth');

// @route   GET api/courses
// @desc    Get all courses
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/courses/:id
// @desc    Get course by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }
    res.json(course);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Course not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/courses/seed
// @desc    Seed database with initial courses (Dev only)
// @access  Public (for easier initial setup)
router.get('/seed/data', async (req, res) => {
  try {
    const courses = [
      {
        title: "Java",
        thumbnail: "https://img.youtube.com/vi/eIrMbAQSU34/maxresdefault.jpg",
        description: "Master Java programming from scratch.",
        instructor: "Dr. Angela Yu",
        duration: "101 Hr 15.5 mins",
        modulesCount: 23,
        category: "Programming",
        modules: [
          { title: "Introduction to Java", videoUrl: "https://www.youtube.com/embed/eIrMbAQSU34", duration: "15:00" },
          { title: "Variables and Data Types", videoUrl: "https://www.youtube.com/embed/RRubcjpTkks", duration: "20:30" }
        ]
      },
      {
        title: "Hibernate",
        thumbnail: "https://img.youtube.com/vi/Yv2xctJxE-w/maxresdefault.jpg",
        description: "Learn Hibernate framework for database mapping.",
        instructor: "Chad Darby",
        duration: "7 Hr 39 mins",
        modulesCount: 6,
        category: "Backend",
        modules: [
          { title: "Hibernate Overview", videoUrl: "https://www.youtube.com/embed/Yv2xctJxE-w", duration: "12:00" }
        ]
      },
      {
        title: "Springs",
        thumbnail: "https://img.youtube.com/vi/If1Lw4pLLEo/maxresdefault.jpg",
        description: "Deep dive into Spring Framework.",
        instructor: "Chad Darby",
        duration: "8 Hr 51 mins",
        modulesCount: 8,
        category: "Backend",
        modules: [
          { title: "Spring Core", videoUrl: "https://www.youtube.com/embed/If1Lw4pLLEo", duration: "45:00" }
        ]
      },
      {
        title: "Advanced JAVA",
        thumbnail: "https://img.youtube.com/vi/bm0OyhwFDuY/maxresdefault.jpg",
        description: "Takes your Java skills to the next level.",
        instructor: "Navin Reddy",
        duration: "20 Hr 34 mins",
        modulesCount: 3,
        category: "Programming",
        modules: [
          { title: "Servlets and JSP", videoUrl: "https://www.youtube.com/embed/bm0OyhwFDuY", duration: "1:30:00" }
        ]
      },
      {
        title: "Data Structure and Algorithm - Java",
        thumbnail: "https://img.youtube.com/vi/8hly31xKli0/maxresdefault.jpg",
        description: "DSA concepts implemented in Java.",
        instructor: "Abdul Bari",
        duration: "51 Hr 28 mins",
        modulesCount: 14,
        category: "CS Fundamentals",
        modules: [
          { title: "Introduction to Algorithms", videoUrl: "https://www.youtube.com/embed/8hly31xKli0", duration: "25:00" }
        ]
      },
      {
        title: "HTML and CSS",
        thumbnail: "https://img.youtube.com/vi/G3e-cpL7ofc/maxresdefault.jpg",
        description: "Build beautiful websites with HTML & CSS.",
        instructor: "SuperSimpleDev",
        duration: "18 Hr 5 mins",
        modulesCount: 2,
        category: "Frontend",
        modules: [
          { title: "HTML Basics", videoUrl: "https://www.youtube.com/embed/G3e-cpL7ofc", duration: "6:00:00" }
        ]
      }
    ];

    await Course.deleteMany({}); // Clear existing
    await Course.insertMany(courses);

    res.json({ msg: "Courses seeded successfully", count: courses.length });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
