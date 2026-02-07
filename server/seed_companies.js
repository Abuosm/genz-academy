const mongoose = require('mongoose');
const Company = require('./models/Company');
require('dotenv').config();

const companies = [
  {
    name: "Zoho",
    logo: "https://logo.clearbit.com/zoho.com",
    tags: ["Core Java", "Programming", "DSA"],
    interviewRounds: [
      {
        roundName: "Level I: Matrix Test",
        questions: [
          "Transformations on Matrix (Row 1: 1,1,1,1; Row 2: 2,4,8,16; etc.)",
          "Matrix concatenation problems",
          "Friend/Enemy Matrix puzzles",
          "Numeric Matrix calculations (multiples of 5, division of sums)"
        ]
      },
      {
        roundName: "Section 2: Quantitative Aptitude",
        questions: [
          "Class ratio problem (boys/girls total students)",
          "Milk and water mixture ratio optimization",
          "Cuboids vs Cube volume accommodation",
          "Equilateral triangle circum circle area ratios"
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
          "Explain your final year project in detail.",
          "What are your strengths and weaknesses?"
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
        roundName: "Round 1: Phone Screen",
        questions: [
          "Serialize and deserialize a binary tree",
          "Find the longest increasing subsequence",
          "Optimize O(n log n) solutions"
        ]
      },
      {
        roundName: "Round 2-3: Onsite Coding",
        questions: [
          "Critical connections in a network (Tarjan's algorithm)",
          "Word Break II - Return all possible sentences",
          "Median of two sorted arrays"
        ]
      },
      {
        roundName: "Round 4: System Design",
        questions: [
          "Design Google Drive (File storage, versioning)",
          "Design YouTube architecture (CDN, Streaming)",
          "Design a Distributed Cache"
        ]
      }
    ]
  },
  {
    name: "Meta",
    logo: "https://logo.clearbit.com/meta.com",
    tags: ["DSA", "System Design", "Programming"],
    interviewRounds: [
      {
        roundName: "Round 1: Screening",
        questions: [
          "Clone a graph (Deep copy)",
          "Validate Binary Search Tree",
          "Subarray Sum Equals K"
        ]
      },
      {
        roundName: "Round 2-3: Coding Interviews",
        questions: [
          "Merge Intervals",
          "Number of Islands",
          "Lowest Common Ancestor of a Binary Tree"
        ]
      },
      {
        roundName: "Round 4: System Design",
        questions: [
          "Design Facebook News Feed",
          "Design Messenger application (WebSockets)",
          "Design a live commenting system"
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
        roundName: "Round 1: Online Assessment",
        questions: [
          "Two Sum variations",
          "Array/String manipulation (Medium)",
          "Situational Work Style Assessment"
        ]
      },
      {
        roundName: "Round 2-4: Technical Onsite",
        questions: [
          "LP: Customer Obsession - Tell me about a time you went above and beyond.",
          "LRU Cache implementation",
          "K Closest Points to Origin"
        ]
      },
      {
        roundName: "Round 6: Bar Raiser",
        questions: [
          "LP: Bias for Action - Tell me about a calculated risk you took.",
          "LP: Dive Deep - Digging into a problem no one else wanted to solve."
        ]
      }
    ]
  },
  {
    name: "IBM",
    logo: "https://logo.clearbit.com/ibm.com",
    tags: ["Programming", "Cognitive"],
    interviewRounds: [
      {
        roundName: "Round 1: Cognitive Ability Games",
        questions: [
          "Gridlock: Spatial reasoning puzzle",
          "Resemble: Visual processing match",
          "Numbubbles: Quantitative analysis"
        ]
      },
      {
        roundName: "Round 3: Coding Interview",
        questions: [
          "Longest palindromic substring",
          "Merge two sorted arrays",
          "DBMS Normalization concepts"
        ]
      }
    ]
  },
  {
    name: "ITC Infotech",
    logo: "https://logo.clearbit.com/itcinfotech.com",
    tags: ["Core Java", "DSA", "Aptitude"],
    interviewRounds: [
      {
        roundName: "Round 1: Online Assessment",
        questions: [
          "Logical: Coding decoding, selection tables",
          "Automata Fix: Debugging syntax/logical errors"
        ]
      },
      {
        roundName: "Round 2: Technical Round",
        questions: [
          "Difference between HashMap and Hashtable",
          "SQL standard joins and self-join",
          "Factorial using recursion"
        ]
      }
    ]
  },
  {
    name: "ThoughtMakes AI",
    logo: "https://logo.clearbit.com/thoughtmakes.com",
    tags: ["Core Java", "OOPs"],
    interviewRounds: [
      {
        roundName: "Round 1: Technical Screening",
        questions: [
          "JVM: Difference between == and .equals()",
          "Deep dive into Runtime Polymorphism",
          "Internal working of HashSet and collision handling"
        ]
      },
      {
        roundName: "Round 2: System & Coding",
        questions: [
          "Longest substring without repeating characters",
          "Implement custom ArrayList with basic methods",
          "SQL query for employees with same salary"
        ]
      }
    ]
  },
  {
    name: "Zeta",
    logo: "https://logo.clearbit.com/zeta.tech",
    tags: ["DSA", "System Design", "Fintech"],
    interviewRounds: [
      {
        roundName: "Round 1: Coding Challenge",
        questions: [
          "Graph/Tree traversal (BFS/DFS)",
          "Dynamic Programming optimization problems"
        ]
      },
      {
        roundName: "Round 2: System Design",
        questions: [
          "Design a Scalable Payment Gateway",
          "Design a Notification System",
          "Database Schema for E-commerce Orders"
        ]
      }
    ]
  },
  {
    name: "Microsoft",
    logo: "https://logo.clearbit.com/microsoft.com",
    tags: ["OS", "Programming", "Cloud"],
    interviewRounds: [
      {
        roundName: "Technical Interview",
        questions: ["Maximum Subarray", "Reverse Linked List", "Maximum Depth of Binary Tree"]
      }
    ]
  },
  {
    name: "Apple",
    logo: "https://logo.clearbit.com/apple.com",
    tags: ["Performance", "Hardware", "Linked List"],
    interviewRounds: [
      {
        roundName: "Onsite Round",
        questions: ["Contains Duplicate", "Climbing Stairs", "Linked List Cycle"]
      }
    ]
  },
  {
    name: "Netflix",
    logo: "https://logo.clearbit.com/netflix.com",
    tags: ["Microservices", "Scalability", "Graphs"],
    interviewRounds: [
      {
        roundName: "Technical Screen",
        questions: ["Longest Increasing Subsequence", "Pacific Atlantic Water Flow"]
      }
    ]
  },
  {
    name: "Adobe",
    logo: "https://logo.clearbit.com/adobe.com",
    tags: ["Software", "UI", "Stacks"],
    interviewRounds: [
      {
        roundName: "Coding Interview",
        questions: ["Coin Change", "Valid Anagram", "Invert Binary Tree"]
      }
    ]
  },
  {
    name: "Uber",
    logo: "https://logo.clearbit.com/uber.com",
    tags: ["Graphs", "Routing", "DP"],
    interviewRounds: [
      {
        roundName: "Technical Round",
        questions: ["Number of Islands", "Clone Graph", "Maximum Product Subarray"]
      }
    ]
  },
  {
    name: "Airbnb",
    logo: "https://logo.clearbit.com/airbnb.com",
    tags: ["Marketplace", "Search", "Strings"],
    interviewRounds: [
      {
        roundName: "Coding Challenge",
        questions: ["Palindrome Number", "Find Minimum in Rotated Sorted Array", "Reorder List"]
      }
    ]
  },
  {
    name: "Sigmoid",
    logo: "https://logo.clearbit.com/sigmoid.com",
    tags: ["Big Data", "SQL", "LRU"],
    interviewRounds: [
      {
        roundName: "Round 1: Online Coding & SQL",
        questions: ["SQL RANK/DENSE_RANK differences", "DP Coin Change", "Tree Height"]
      },
      {
        roundName: "Round 2: Technical Interview",
        questions: ["LRU Cache implementation", "Garbage Collection generations", "Rate Limiter design"]
      }
    ]
  },
  {
    name: "XPLORIA",
    logo: "https://logo.clearbit.com/xploria.com",
    tags: ["Core Java", "Aptitude"],
    interviewRounds: [
      {
        roundName: "2nd Round (Technical/HR)",
        questions: ["Second Largest element in Python", "Python Modules exploration"]
      },
      {
        roundName: "3rd Round",
        questions: ["SQL Joins for Student/State mapping", "List frequency count implementation"]
      }
    ]
  },
  {
    name: "Starverse Technologies",
    logo: "https://logo.clearbit.com/starverse.in",
    tags: ["Core Java", "Aptitude"],
    interviewRounds: [
      { roundName: "Round 1: Aptitude & Logical", questions: ["Number Series completion", "Blood Relations puzzles", "Coding-Decoding"] },
      { roundName: "Round 2: Java Coding", questions: ["Fibonacci using recursion", "Armstrong number check", "String word reversal"] }
    ]
  },
  {
    name: "iMutiz",
    logo: "https://logo.clearbit.com/imutiz.com",
    tags: ["Core Java", "Multithreading"],
    interviewRounds: [
      { roundName: "Level 1: Basic Screening", questions: ["Purpose of static keyword", "Final vs Finally vs Finalize"] },
      { roundName: "Level 2: Deep Dive Technical", questions: ["ArrayList vs LinkedList", "Thread lifecycle and Deadlock", "Dutch National Flag problem"] }
    ]
  },
  {
    name: "BridgeLabz",
    logo: "https://logo.clearbit.com/bridgelabz.com",
    tags: ["Core Java", "DSA"],
    interviewRounds: [
      { roundName: "Online Test", questions: ["Quantitative Ability (Probability, Time & Work)", "Logical Reasoning"] },
      { roundName: "Technical Interview", questions: ["Methods in Object class", "Bubble Sort implementation", "SQL Normalization (1NF, 2NF, 3NF)"] }
    ]
  },
  {
    name: "BDI Plus Lab Pvt.Ltd",
    logo: "https://logo.clearbit.com/bdipluslab.com",
    tags: ["Core Java", "SQL"],
    interviewRounds: [
      { roundName: "Round 1: Group Discussion", questions: ["Impact of AI on Employment", "Work from Home vs Office"] },
      { roundName: "Round 2: Technical Interview", questions: ["Java Overloading vs Overriding rules", "Abstract Class vs Interface", "Second highest salary SQL query"] }
    ]
  },
  {
    name: "Molecular Connections",
    logo: "https://logo.clearbit.com/molecularconnections.com",
    tags: ["C Programming", "Java"],
    interviewRounds: [
      { roundName: "Round 1: Written Test", questions: ["Section B: C Pointers, Structures, Unions", "Section C: Java Inheritance, Threads"] },
      { roundName: "Round 2: Technical F2F", questions: ["Dangling pointers in C", "malloc() vs calloc() vs realloc()", "Thread lifecycle management"] }
    ]
  },
  {
    name: "Moolya Software",
    logo: "https://logo.clearbit.com/moolya.com",
    tags: ["Testing", "Logic"],
    interviewRounds: [
      { roundName: "Round 1: Exploratory Testing", questions: ["Test a pen: write unique scenarios", "Elevator testing (Performance, UI, Safety)"] },
      { roundName: "Round 2: Logic", questions: ["3 Bulbs and 3 Switches puzzle", "Selenium WebDriver basics"] }
    ]
  },
  {
    name: "Appxccelerate",
    logo: "https://logo.clearbit.com/appxccelerate.com",
    tags: ["Core Java", "SQL"],
    interviewRounds: [
      { roundName: "Round 1: Technical Screening", questions: ["Java Collection hierarchy", "Difference between Set and List", "SQL Relational concepts (PK, FK)"] }
    ]
  },
  {
    name: "Sans Cloud Software",
    logo: "https://logo.clearbit.com/sanscloud.com",
    tags: ["Cloud", "Core Java"],
    interviewRounds: [
      { roundName: "Round 1: Cloud & Java Basics", questions: ["IaaS vs PaaS vs SaaS", "Why is String immutable?", "public static void main decomposition"] },
      { roundName: "Round 2: Coding & Logic", questions: ["IPv4 validation implementation", "Swap two numbers without third variable"] }
    ]
  },
  {
    name: "FanIdea",
    logo: "https://logo.clearbit.com/fanidea.com",
    tags: ["Core Java", "SQL"],
    interviewRounds: [
      { roundName: "Round 1: Aptitude Test", questions: ["Seating arrangement puzzles", "Data Interpretation (Charts/Graphs)"] },
      { roundName: "Round 2: Technical F2F", questions: ["Reverse a Linked List", "Middle element of Linked List", "Multilevel inheritance"] }
    ]
  },
  {
    name: "Valuebound",
    logo: "https://logo.clearbit.com/valuebound.com",
    tags: ["Web Dev", "PHP"],
    interviewRounds: [
      { roundName: "Round 1: Web Technologies", questions: ["CSS Flexbox vs Grid", "PHP Associative Arrays", "Responsive design principles"] },
      { roundName: "Round 2: General Programming", questions: ["REST API Idempotency", "Email validation using Regex"] }
    ]
  },
  {
    name: "Infocareer",
    logo: "https://logo.clearbit.com/infocareer.co.in",
    tags: ["SQL", "Javascript"],
    interviewRounds: [
      { roundName: "Round 1: Web & SQL", questions: ["Javascript Closures & Event Bubbling", "DELETE vs TRUNCATE", "Primary vs Unique Key"] },
      { roundName: "Round 2: Practical", questions: ["Login form validation script", "Three-table JOIN query"] }
    ]
  },
  {
    name: "Solera",
    logo: "https://logo.clearbit.com/solera.com",
    tags: ["SQL", "Microservices"],
    interviewRounds: [
      { roundName: "Round 1: Database Concepts", questions: ["ACID Properties deep dive", "Clustered vs Non-clustered index", "3rd Normal Form conversion"] },
      { roundName: "Round 2: Architecture & Tech", questions: ["Monolithic vs Microservices benefits", "CI/CD Pipeline basics"] }
    ]
  }
];

const seedCompaniesExt = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/tai-learning-platform';
    await mongoose.connect(uri);
    console.log('🌱 Seeding Comprehensive Companies Data...');

    await Company.deleteMany({});
    await Company.insertMany(companies);

    console.log(`✅ Successfully seeded ${companies.length} companies!`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding Error:', err.message);
    process.exit(1);
  }
};

seedCompaniesExt();
