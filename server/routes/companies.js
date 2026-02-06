const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const auth = require('../middleware/auth');

// @route   GET api/companies
// @desc    Get all companies
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const companies = await Company.find().sort({ name: 1 });
    res.json(companies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/companies/:id
// @desc    Get company by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ msg: 'Company not found' });
    }
    res.json(company);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Company not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/companies/:id/favorite
// @desc    Toggle favorite company
// @access  Private
router.post('/:id/favorite', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    const companyId = req.params.id;

    // Check if company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ msg: 'Company not found' });
    }

    // Toggle favorite
    const index = user.favoriteCompanies.indexOf(companyId);
    if (index > -1) {
      // Remove from favorites
      user.favoriteCompanies.splice(index, 1);
      await user.save();
      res.json({ msg: 'Company removed from favorites', isFavorite: false });
    } else {
      // Add to favorites
      user.favoriteCompanies.push(companyId);
      await user.save();
      res.json({ msg: 'Company added to favorites', isFavorite: true });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/companies/favorites/list
// @desc    Get user's favorite companies
// @access  Private
router.get('/favorites/list', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id).populate('favoriteCompanies');
    res.json(user.favoriteCompanies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/companies/seed/data
// @desc    Seed companies data (Development only)
// @access  Public
router.get('/seed/data', async (req, res) => {
  try {
    const companies = [
      {
        name: "Zoho",
        logo: "https://logo.clearbit.com/zoho.com",
        tags: ["Core Java", "Programming", "DSA"],
        interviewRounds: [
          {
            roundName: "Level I: Matrix Test (15 mins)",
            questions: [
              "Directions 1-5: Transformations on Matrix (Row 1: 1,1,1,1; Row 2: 2,4,8,16; etc.)",
              "Q1: After transformation 1 what will be the element in Row 2 and Column 1? (Options: 64, 2, 8, none)",
              "Q2: After transformation 3 what will be the elements of column 1? (Options: 3,2,1,4 etc.)",
              "Q3: After transformation 2 what will be the element in Row 4 and Column 4? (Options: 1, 16, 81, 256)",
              "Directions 6-8: Matrix concatenation problem (Matrix1: are, loa, fur; Matrix2: deg, lqr...)",
              "Q6: Last element in dictionary among 9 elements after concatenation? (Options: uar, uet, uux, ufe)",
              "Directions 9-12: Friend/Enemy Matrix (Person A, B, C...)",
              "Q9: How many pairs of friends are there?",
              "Q10: How many pairs of enemies are there?",
              "Directions 13-15: Numeric Matrix (00, 34, 164...)",
              "Q13: Division of addition of numbers above 50 to multiplied numbers below 10?",
              "Q15: If col 1 interchanged with col 4, row 1 subtracted from row 4, how many multiples of 5?"
            ]
          },
          {
            roundName: "Section 2: Quantitative Aptitude",
            questions: [
              "Q1: In a class, 24 boys are there and one seventh of total are girls. Total students?",
              "Q2: Mixture of milk and water 5:1. Add 20L water, ratio becomes 5:6. Original milk?",
              "Q3: How many cuboids of 2x3x4m can be accommodated in a cube of side 22m?",
              "Q4: Ratio of areas of circum circle and in circle of an equilateral triangle?",
              "Q5: Two doctors, three lawyers and one teacher picnic puzzle."
            ]
          },
          {
            roundName: "Level III – Advanced Programming Test",
            questions: [
              "Complex pattern printing (Pyramid, Diamond, Pascal's triangle)",
              "Advanced String manipulation (Anagrams, Palindromes within substrings)",
              "Data Structures implementation (Stack/Queue using Arrays)"
            ]
          },
          {
            roundName: "Level IV – Technical/HR Interview",
            questions: [
              "Why Zoho? (Focus on culture and bootstrap philosophy)",
              "Willingness to relocate to Chennai/Tenkasi office.",
              "Explain your final year project in detail.",
              "What are your strengths and weaknesses?"
            ]
          }
        ]
      },
      {
        name: "XPLORIA",
        logo: "https://logo.clearbit.com/xploria.com",
        tags: ["Core Java", "Aptitude"],
        interviewRounds: [
          {
            roundName: "Aptitude",
            questions: [
              "Time and work: 2 Questions",
              "TDS: 1 Question",
              "Calendar: 1 Question",
              "Divisors: 1 Question",
              "Ratios and Proportions: 2 Questions",
              "Percentages: 2 Questions"
            ]
          },
          {
            roundName: "2nd Round (Technical/HR)",
            questions: [
              "Final year project discussion",
              "Find the Second Largest element in a list in Python",
              "Explain Modules in Python",
              "Family Background",
              "Where did you learn Python?"
            ]
          },
          {
            roundName: "3rd Round",
            questions: [
              "Why do you need this job?",
              "You did 6 months Java full stack, then why Python?",
              "Given a list with many elements, find which element appears how many times.",
              "SQL Query: Print Student table name and state using joins from the AP name and state."
            ]
          }
        ]
      },
      {
        name: "ThoughtMakes AI",
        logo: "https://logo.clearbit.com/thoughtmakes.com",
        tags: ["Core Java"],
        interviewRounds: [
          {
            roundName: "Round 1: Technical Screening",
            questions: [
              "Java Basics: Explain the difference between '==' and '.equals()' method with examples.",
              "OOPs: deep dive into Polymorphism (Runtime vs Compile-time).",
              "Exceptions: Hierarchy of Exception class. Difference between ClassNotFoundException and NoClassDefFoundError.",
              "Collections: Internal working of HashSet and how collision is handled."
            ]
          },
          {
            roundName: "Round 2: System & Coding",
            questions: [
              "Program: Find the longest substring without repeating characters.",
              "Program: Implement a custom ArrayList class with add(), get(), and remove() methods.",
              "SQL: Write a query to fetch employees who have the same salary.",
              "Scenario: How would you handle a memory leak in a Java application?"
            ]
          }
        ]
      },
      {
        name: "Starverse Technologies",
        logo: "https://logo.clearbit.com/starverse.in",
        tags: ["Core Java"],
        interviewRounds: [
          {
            roundName: "Round 1: Aptitude & Logical (30 mins)",
            questions: [
              "Number Series: 2, 6, 12, 20, 30, ?, 56 (Answer: 42)",
              "Blood Relations: Pointing to a photograph, a man said...",
              "Coding-Decoding: If 'SKY' is coded as 'OGJ', how is 'CLOUD' coded?",
              "Data Interpretation: Bar graph analysis of company sales."
            ]
          },
          {
            roundName: "Round 2: Java Coding",
            questions: [
              "Write a program to print the Fibonacci series up to N terms using recursion.",
              "Check if a given number is an Armstrong number.",
              "Find the factorial of a large number (using BigInteger).",
              "String Reversal: Reverse each word in a given sentence."
            ]
          },
          {
            roundName: "Round 3: HR Discussion",
            questions: [
              "Tell me about a time you faced a challenge in your project.",
              "Where do you see yourself in 3 years?",
              "Are you comfortable with night shifts if required?"
            ]
          }
        ]
      },
      {
        name: "iMutiz",
        logo: "https://logo.clearbit.com/imutiz.com",
        tags: ["Core Java"],
        interviewRounds: [
          {
            roundName: "Level 1: Basic Screening",
            questions: [
              "Self Introduction and Project overview.",
              "Java: What is the purpose of the 'static' keyword? Can we override static methods?",
              "Java: Explain the 'final', 'finally', and 'finalize' keywords."
            ]
          },
          {
            roundName: "Level 2: Deep Dive Technical",
            questions: [
              "Collections: Difference between ArrayList and LinkedList. When to use which?",
              "Multithreading: Explain the lifecycle of a Thread. What is deadlock?",
              "Coding: Write a program to find the duplicate characters in a string.",
              "Coding: Sort an array of 0s, 1s, and 2s (Dutch National Flag problem)."
            ]
          }
        ]
      },
      {
        name: "BridgeLabz",
        logo: "https://logo.clearbit.com/bridgelabz.com",
        tags: ["Core Java"],
        interviewRounds: [
          {
            roundName: "Online Test (AMCAT Pattern)",
            questions: [
              "Quantitative Ability: HCF/LCM, Probability, Time & Work.",
              "Logical Reasoning: Direction sense, Coding-Decoding.",
              "Verbal Ability: Sentence Correction, Synonyms/Antonyms."
            ]
          },
          {
            roundName: "Technical Interview",
            questions: [
              "Explain the Fellowship Program model.",
              "Java: What is Object Class? Name methods in Object class.",
              "Coding: Bubble Sort implementation and time complexity.",
              "Coding: Check if two strings are Anagrams.",
              "Database: What is Normalization? Explain 1NF, 2NF, 3NF."
            ]
          },
          {
            roundName: "HR Interview",
            questions: [
              "Why do you want to join BridgeLabz?",
              "Discuss your final year project.",
              "Relocation and Bond agreement discussion."
            ]
          }
        ]
      },
      {
        name: "BDI Plus Lab Pvt.Ltd",
        logo: "https://logo.clearbit.com/bdipluslab.com",
        tags: ["Core Java"],
        interviewRounds: [
          {
            roundName: "Round 1: Group Discussion",
            questions: [
              "Topic: Impact of Artificial Intelligence on Employment.",
              "Topic: Work from Home vs Work from Office.",
              "Topic: Cashless Economy: Pros and Cons."
            ]
          },
          {
            roundName: "Round 2: Technical Interview",
            questions: [
              "Project: Detailed explanation of your role and technologies used.",
              "Java: Overloading vs Overriding (Rules for exceptions and return types).",
              "Java: What is an Interface? Difference between Abstract Class and Interface.",
              "SQL: Write a query to find the second highest salary from the Employee table."
            ]
          },
          {
            roundName: "Round 3: HR",
            questions: [
              "Family background.",
              "Strengths and Weaknesses.",
              "Why BDI Plus?"
            ]
          }
        ]
      },
      {
        name: "Bandhoo Solutions",
        logo: "https://logo.clearbit.com/bandhoo.com",
        tags: ["Programming"],
        interviewRounds: [
          {
            roundName: "Round 1: Aptitude & Reasoning",
            questions: [
              "Quants: Problems on Trains, Boats and Streams.",
              "Logical: Syllogisms, Data Sufficiency.",
              "Verbal: Reading Comprehension, Sentence Completion."
            ]
          },
          {
            roundName: "Round 2: Technical Interview",
            questions: [
              "Puzzle: You have 3 jugs of capacities 8, 5, and 3 liters. Measure exactly 4 liters.",
              "Algorithm: Write pseudo-code to rotate a matrix by 90 degrees.",
              "Data Structures: Explain how a Stack works. Applications of Grid.",
              "Web Basics: Explain the difference between GET and POST methods."
            ]
          }
        ]
      },
      {
        name: "IBM",
        logo: "https://logo.clearbit.com/ibm.com",
        tags: ["Programming"],
        interviewRounds: [
          {
            roundName: "Round 1: Cognitive Ability Games",
            questions: [
              "Gridlock: Solve the puzzle by fitting blocks into the grid (Spatial reasoning).",
              "Resemble: Match the image to the target image (Visual processing).",
              "Numbubbles: Pop bubbles with equations that equal the target number (Quantitative analysis).",
              "Tally Up: Identify the highest value group of tokens."
            ]
          },
          {
            roundName: "Round 2: English Language Assessment",
            questions: [
              "Spelling check: Identify correct spellings.",
              "Grammar & Vocabulary: Fill in the blanks.",
              "Business Communication: Email etiquette and error spotting."
            ]
          },
          {
            roundName: "Round 3: Coding Interview",
            questions: [
              "String: Given a string, return the longest palindromic substring.",
              "Arrays: Merge two sorted arrays.",
              "SQL: Query to find the 3rd highest salary.",
              "Concept: Explain DBMS Normalization."
            ]
          }
        ]
      },
      {
        name: "Molecular Connections",
        logo: "https://logo.clearbit.com/molecularconnections.com",
        tags: ["Programming"],
        interviewRounds: [
          {
            roundName: "Round 1: Written Test (60 Mins)",
            questions: [
              "Section A: Quantitative Aptitude (Time & Distance, Percentages).",
              "Section B: C Programming MCQs (Pointers, Structures, Unions).",
              "Section C: Java MCQs (Inheritance, Threads)."
            ]
          },
          {
            roundName: "Round 2: Technical F2F",
            questions: [
              "C Programming: Explain malloc(), calloc(), realloc() and free().",
              "Memory Management: What is a dangling pointer?",
              "Java: Explain the lifecycle of a thread. How to stop a thread?",
              "Project: Discussion on your role and challenges faced."
            ]
          }
        ]
      },
      {
        name: "Sigmoid",
        logo: "https://logo.clearbit.com/sigmoid.com",
        tags: ["Core Java", "SQL"],
        interviewRounds: [
          {
            roundName: "Round 1: Online Coding & SQL",
            questions: [
              "SQL: Write a query to find the department with the maximum number of employees.",
              "SQL: Explain the difference between RANK(), DENSE_RANK() and ROW_NUMBER().",
              "Algo: Dynamic Programming - Coin Change Problem.",
              "Algo: Find the height of a Binary Tree."
            ]
          },
          {
            roundName: "Round 2: Technical Interview",
            questions: [
              "DSA: Implement an LRU Cache.",
              "Java: How does Garbage Collection work? Explain generations.",
              "System Design: Design a Rate Limiter.",
              "Big Data: Basics of Hadoop/Spark (if mentioned in resume)."
            ]
          }
        ]
      },
      {
        name: "Moolya Software",
        logo: "https://logo.clearbit.com/moolya.com",
        tags: ["Programming"],
        interviewRounds: [
          {
            roundName: "Round 1: Exploratory Testing",
            questions: [
              "Testing: Test a pen. Write as many unique scenarios as possible.",
              "Testing: How would you test a Lift/Elevator? (Functional, UI, Safety, Performance).",
              "Concept: Explain the difference between Severity and Priority with examples."
            ]
          },
          {
            roundName: "Round 2: Problem Solving & Logic",
            questions: [
              "Puzzle: 3 Bulbs and 3 Switches problem.",
              "Scenario: You found a bug but developer denies it. How do you convince them?",
              "Automation: Basic Selenium WebDriver questions (Locators, Waits)."
            ]
          }
        ]
      },
      {
        name: "ITC Infotech",
        logo: "https://logo.clearbit.com/itcinfotech.com",
        tags: ["Programming", "Core Java", "DSA"],
        interviewRounds: [
          {
            roundName: "Round 1: Online Assessment (AMCAT)",
            questions: [
              "Logical: Coding decoding, selection decision tables, syllogisms.",
              "Quants: HCF/LCM, numbers, probability, permutations.",
              "Information Handling/Excel: Basic formulas and data sorting.",
              "Automata Fix: Debugging logical and syntax errors in C/Java code snippets."
            ]
          },
          {
            roundName: "Round 2: Technical Round",
            questions: [
              "Java: Difference between HashMap and Hashtable.",
              "SQL: Explain standard joins and self-join with an example.",
              "Project: Challenges faced during implementation.",
              "Coding: Write a program to find the factorial of a number using recursion."
            ]
          },
          {
            roundName: "Round 3: HR Round",
            questions: [
              "Are you willing to work in shifts?",
              "What do you know about ITC Infotech?",
              "Situation: How do you handle a tight deadline?"
            ]
          }
        ]

      },
      {
        name: "Appxccelerate",
        logo: "https://logo.clearbit.com/appxccelerate.com",
        tags: ["Core Java", "SQL"],
        interviewRounds: [
          {
            roundName: "Round 1: Technical Screening",
            questions: [
              "Java: Explain the collection hierarchy. What is the difference between Set and List?",
              "Java: Explain 'super' and 'this' keywords.",
              "SQL: What consists of a Relational Database? PK, FK concepts.",
              "SQL: Write a query to fetch the count of employees working in the department 'Admin'."
            ]
          },
          {
            roundName: "Round 2: Managerial/Behavioral",
            questions: [
              "Project Management: Do you know about SDLC? Explain Agile.",
              "Scenario: If a requirement changes last minute, how do you handle it?",
              "Discussion on career goals and alignment with company vision."
            ]
          }
        ]
      },
      {
        name: "Sans Cloud Software",
        logo: "https://logo.clearbit.com/sanscloud.com",
        tags: ["Core Java", "SQL"],
        interviewRounds: [
          {
            roundName: "Round 1: Cloud & Java Basics",
            questions: [
              "Cloud: Basic definitions of IaaS, PaaS, SaaS. AWS vs Azure (High level).",
              "Java: Explain the main method signature: public static void main(String[] args).",
              "Java: String immutability in Java. Why is String immutable?"
            ]
          },
          {
            roundName: "Round 2: Coding & Logic",
            questions: [
              "Coding: Validate an IP Address (IPv4) using String manipulation.",
              "Coding: Count the number of words in a string using HashMap.",
              "Logic: Swap two numbers without using a third variable."
            ]
          }
        ]
      },
      {
        name: "FanIdea",
        logo: "https://logo.clearbit.com/fanidea.com",
        tags: ["Core Java", "Programming", "SQL"],
        interviewRounds: [
          {
            roundName: "Round 1: Aptitude Test",
            questions: [
              "Data Interpretation: Charts and Graphs analysis.",
              "Logical Reasoning: Seating arrangement puzzles.",
              "Verbal: Synonyms, Antonyms, Passage completion."
            ]
          },
          {
            roundName: "Round 2: Technical F2F",
            questions: [
              "Coding: Reverse a Linked List (Whiteboard coding).",
              "Coding: Find the middle element of a Linked List.",
              "Java: Inheritance concepts. Multilevel vs Multiple inheritance.",
              "SQL: Find duplicate records in a table."
            ]
          }
        ]
      },
      {
        name: "Zeta",
        logo: "https://logo.clearbit.com/zeta.tech",
        tags: ["Core Java", "Programming", "DSA", "SQL"],
        interviewRounds: [
          {
            roundName: "Round 1: Coding Challenge (90 Mins)",
            questions: [
              "Easy: Array manipulation problem (e.g., Move zeroes to end).",
              "Medium: Graph/Tree traversal (BFS/DFS) or DP problem.",
              "Hard: Advanced String matching or Optimization problem."
            ]
          },
          {
            roundName: "Round 2: System Design (High Level)",
            questions: [
              "Design a Scalable Payment Gateway (Handling concurrency, failures).",
              "Design a Notification System (Email/SMS/Push).",
              "Database Schema design for an E-commerce Order system."
            ]
          },
          {
            roundName: "Round 3: Managerial & Values",
            questions: [
              "Talk about a time you showed ownership.",
              "Conflict resolution with peers.",
              "Why Fintech? Why Zeta?"
            ]
          }
        ]
      },
      {
        name: "Valuebound",
        logo: "https://logo.clearbit.com/valuebound.com",
        tags: ["Programming"],
        interviewRounds: [
          {
            roundName: "Round 1: Web Technologies",
            questions: [
              "CMS: Basics of Drupal/WordPress architecture (if applicable).",
              "PHP: Associative Arrays, Superglobals ($_POST, $_GET).",
              "Frontend: CSS Flexbox vs Grid. Responsive design principles."
            ]
          },
          {
            roundName: "Round 2: General Programming",
            questions: [
              "HTTP: Explain the request-response cycle.",
              "REST API: What is idempotent? GET vs PUT.",
              "Coding: Write a function to validate an email address using Regex."
            ]
          }
        ]
      },
      {
        name: "Infocareer",
        logo: "https://logo.clearbit.com/infocareer.co.in",
        tags: ["Programming", "SQL", "Javascript"],
        interviewRounds: [
          {
            roundName: "Round 1: Web & SQL",
            questions: [
              "HTML/CSS: Semantic tags, Box Model, position property.",
              "Javascript: Closures, Event Bubbling vs Capturing.",
              "SQL: Difference between DELETE and TRUNCATE.",
              "SQL: What are Constraints? Explain Unique vs Primary Key."
            ]
          },
          {
            roundName: "Round 2: Practical",
            questions: [
              "Create a simple login form validation using Javascript.",
              "Write a query to join three tables (Student, Marks, Subject)."
            ]
          }
        ]
      },
      {
        name: "Solera",
        logo: "https://logo.clearbit.com/solera.com",
        tags: ["SQL", "Programming"],
        interviewRounds: [
          {
            roundName: "Round 1: Database Concepts",
            questions: [
              "ACID Properties: Explain Atomicity and Isolation in detail.",
              "Indexing: Clustered vs Non-clustered index. When to use?",
              "Normalization: Convert a given unnormalized table to 3NF."
            ]
          },
          {
            roundName: "Round 2: Architecture & Tech",
            questions: [
              "Microservices: Benefits over Monolithic architecture.",
              "DevOps: Basic understanding of CI/CD pipelines.",
              "Java/Background: Explain how you handled security in your project."
            ]
          }
        ]
      },
      {
        name: "Google",
        logo: "https://logo.clearbit.com/google.com",
        tags: ["DSA", "System Design", "Programming"],
        interviewRounds: [
          {
            roundName: "Round 1: Phone Screen (45 mins)",
            questions: [
              "Coding: Implement a function to serialize and deserialize a binary tree.",
              "Coding: Find the longest increasing subsequence in an array.",
              "Follow-up: Optimize the solution to O(n log n) time complexity."
            ]
          },
          {
            roundName: "Round 2-3: Onsite Coding (2 rounds)",
            questions: [
              "Graph: Find all critical connections in a network (Tarjan's algorithm).",
              "DP: Word Break II - Return all possible sentences.",
              "String: Implement a basic calculator that supports +, -, *, / and parentheses.",
              "Array: Median of two sorted arrays (Hard)."
            ]
          },
          {
            roundName: "Round 4: System Design",
            questions: [
              "Design Google Drive (File storage, sharing, versioning).",
              "Design YouTube (Video upload, streaming, CDN architecture).",
              "Design a Distributed Cache (Consistent hashing, eviction policies)."
            ]
          },
          {
            roundName: "Round 5: Googleyness & Leadership",
            questions: [
              "Tell me about a time you took a risk and failed.",
              "How do you handle ambiguity in project requirements?",
              "Describe a situation where you had to influence someone without authority.",
              "Why Google? What excites you about this role?"
            ]
          }
        ]
      },
      {
        name: "Meta (Facebook)",
        logo: "https://logo.clearbit.com/meta.com",
        tags: ["DSA", "System Design", "Programming"],
        interviewRounds: [
          {
            roundName: "Round 1: Screening (Phone/Video)",
            questions: [
              "Coding: Clone a graph (Deep copy).",
              "Coding: Validate Binary Search Tree.",
              "Behavioral: Tell me about your most challenging project."
            ]
          },
          {
            roundName: "Round 2-3: Coding Interviews (Onsite)",
            questions: [
              "Array: Subarray Sum Equals K (Hash map approach).",
              "Tree: Lowest Common Ancestor of a Binary Tree.",
              "String: Group Anagrams together.",
              "Intervals: Merge Intervals problem.",
              "Graph: Number of Islands (BFS/DFS)."
            ]
          },
          {
            roundName: "Round 4: System Design (Product)",
            questions: [
              "Design Facebook News Feed (Ranking, personalization).",
              "Design Instagram Stories (Real-time, ephemeral content).",
              "Design a Messenger/Chat application (WebSockets, message delivery).",
              "Design a live commenting system for a post."
            ]
          },
          {
            roundName: "Round 5: Behavioral (Jedi)",
            questions: [
              "Meta's core values: Move Fast, Be Bold, Focus on Impact.",
              "Tell me about a time you had to make a difficult trade-off.",
              "Describe a situation where you disagreed with a team decision.",
              "How do you prioritize when everything is high priority?"
            ]
          }
        ]
      },
      {
        name: "Amazon",
        logo: "https://logo.clearbit.com/amazon.com",
        tags: ["DSA", "System Design", "Leadership Principles"],
        interviewRounds: [
          {
            roundName: "Round 1: Online Assessment (OA)",
            questions: [
              "Coding Question 1: Amazon's most common - Two Sum variations.",
              "Coding Question 2: Array/String manipulation (Medium difficulty).",
              "Work Style Assessment: Situational judgment questions.",
              "Debugging: Fix logical errors in given code snippets."
            ]
          },
          {
            roundName: "Round 2-4: Technical Onsite (LP + Coding)",
            questions: [
              "LP: Customer Obsession - Tell me about a time you went above and beyond.",
              "Coding: LRU Cache implementation.",
              "LP: Ownership - Describe a project you owned end-to-end.",
              "Coding: K Closest Points to Origin (Heap/Quick Select).",
              "LP: Dive Deep - When did you dig into a problem no one else wanted to solve?",
              "Coding: Number of Islands variations."
            ]
          },
          {
            roundName: "Round 5: System Design",
            questions: [
              "Design Amazon's product recommendation system.",
              "Design an inventory management system for warehouses.",
              "Design Amazon Prime Video streaming service.",
              "Design a notification system for order updates."
            ]
          },
          {
            roundName: "Round 6: Bar Raiser",
            questions: [
              "Deep dive into Leadership Principles with STAR format.",
              "LP: Bias for Action - Tell me about a calculated risk you took.",
              "LP: Learn and Be Curious - How do you stay updated with technology?",
              "LP: Earn Trust - Describe a time you built trust with a difficult stakeholder.",
              "Why Amazon? How do you align with our culture?"
            ]
          }
        ]
      }
    ];

    await Company.deleteMany({});
    await Company.insertMany(companies);

    res.json({ msg: "Companies seeded successfully", count: companies.length });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
