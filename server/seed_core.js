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

const companiesData = [
  {
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    description: "Amazon is an American multinational technology company which focuses on e-commerce, cloud computing, digital streaming, and artificial intelligence.",
    industry: "E-commerce & Cloud",
    location: "Seattle, WA",
    website: "https://amazon.jobs",
    difficulty: "Hard",
    questionsCount: 450,
    interviewRounds: [
      {
        roundName: "Round 1: Online Assessment",
        questions: ["Two Sum", "Number of Islands", "Critical Connections in a Network"]
      },
      {
        roundName: "Round 6: Bar Raiser",
        questions: ["LP: Bias for Action - Tell me about a calculated risk you took."]
      }
    ]
  },
  {
    name: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    description: "Google is an American multinational technology company that specializes in Internet-related services and products.",
    industry: "Search & Tech",
    location: "Mountain View, CA",
    website: "https://careers.google.com",
    difficulty: "Hard",
    questionsCount: 600,
    interviewRounds: [
      { roundName: "Technical Round", questions: ["Dynamic Programming", "Graph theory", "Longest Common Subsequence"] }
    ]
  },
  {
    name: "Meta",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
    description: "Meta Platforms, Inc. is an American multinational technology conglomerate based in Menlo Park, California.",
    industry: "Social Media & Metaverse",
    location: "Menlo Park, CA",
    website: "https://www.metacareers.com",
    difficulty: "Hard",
    questionsCount: 500,
    interviewRounds: [
      { roundName: "Coding Round 1", questions: ["Two Sum", "Valid Parentheses"] },
      { roundName: "Coding Round 2", questions: ["Product of Array Except Self", "Merge Two Sorted Lists"] }
    ]
  },
  {
    name: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
    description: "Microsoft Corporation is an American multinational technology corporation which produces computer software, consumer electronics, personal computers, and related services.",
    industry: "Consumer Electronics & Software",
    location: "Redmond, WA",
    website: "https://careers.microsoft.com",
    difficulty: "Hard",
    questionsCount: 400,
    interviewRounds: [
      { roundName: "Technical Interview", questions: ["Maximum Subarray", "Reverse Linked List", "Maximum Depth of Binary Tree"] }
    ]
  },
  {
    name: "Apple",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    description: "Apple Inc. is an American multinational technology company that specializes in consumer electronics, software and online services.",
    industry: "Consumer Electronics & Digital Services",
    location: "Cupertino, CA",
    website: "https://www.apple.com/jobs",
    difficulty: "Hard",
    questionsCount: 350,
    interviewRounds: [
      { roundName: "Onsite Round", questions: ["Contains Duplicate", "Climbing Stairs", "Linked List Cycle"] }
    ]
  },
  {
    name: "Netflix",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    description: "Netflix, Inc. is an American technology and media-services provider and production company.",
    industry: "Entertainment & Streaming",
    location: "Los Gatos, CA",
    website: "https://jobs.netflix.com",
    difficulty: "Hard",
    questionsCount: 200,
    interviewRounds: [
      { roundName: "Technical Screen", questions: ["Longest Increasing Subsequence", "Pacific Atlantic Water Flow"] }
    ]
  },
  {
    name: "Adobe",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.png",
    description: "Adobe Inc. is an American multinational computer software company.",
    industry: "Software & Creativity",
    location: "San Jose, CA",
    website: "https://www.adobe.com/careers",
    difficulty: "Medium",
    questionsCount: 300,
    interviewRounds: [
      { roundName: "Coding Interview", questions: ["Coin Change", "Valid Anagram", "Invert Binary Tree"] }
    ]
  },
  {
    name: "Uber",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/58/Uber_logo_2018.svg",
    description: "Uber Technologies, Inc. is an American mobility as a service provider.",
    industry: "Transportation & Mobility",
    location: "San Francisco, CA",
    website: "https://www.uber.com/careers",
    difficulty: "Hard",
    questionsCount: 300,
    interviewRounds: [
      { roundName: "Technical Round", questions: ["Number of Islands", "Clone Graph", "Maximum Product Subarray"] }
    ]
  },
  {
    name: "Airbnb",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg",
    description: "Airbnb, Inc. is an American company that operates an online marketplace for lodging personally owned properties.",
    industry: "Hospitality & Marketplace",
    location: "San Francisco, CA",
    website: "https://careers.airbnb.com",
    difficulty: "Medium",
    questionsCount: 250,
    interviewRounds: [
      { roundName: "Coding Challenge", questions: ["Palindrome Number", "Find Minimum in Rotated Sorted Array", "Reorder List"] }
    ]
  },
  {
    name: "Zomato",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png",
    description: "Zomato is an Indian multinational restaurant aggregator and food delivery company.",
    industry: "Food Delivery & Technology",
    location: "Gurugram, India",
    website: "https://www.zomato.com/careers",
    difficulty: "Medium",
    questionsCount: 150,
    interviewRounds: [
      { roundName: "Technical Interview", questions: ["Two Sum", "Best Time to Buy and Sell Stock", "Merge Two Sorted Lists"] }
    ]
  }
];

async function seedCore() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tai-learning-platform');
    console.log('🌱 Seeding Core Data...');

    await Course.deleteMany({});
    await Course.insertMany(courses);
    console.log('✅ Courses Seeded');

    await Company.deleteMany({});
    await Company.insertMany(companiesData);
    console.log('✅ Companies Seeded');

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedCore();
