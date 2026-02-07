const mongoose = require('mongoose');
const Course = require('./models/Course');
const Company = require('./models/Company');
require('dotenv').config();

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

// Companies data moved to seed_companies.js

async function seedCore() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tai-learning-platform');
    console.log('🌱 Seeding Core Data...');

    await Course.deleteMany({});
    await Course.insertMany(courses);
    console.log('✅ Courses Seeded');

    // await Company.deleteMany({});
    // await Company.insertMany(companiesData);
    // console.log('✅ Companies Seeded');

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedCore();
