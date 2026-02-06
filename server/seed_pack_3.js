const mongoose = require('mongoose');
const Assignment = require('./models/Assignment');
const Course = require('./models/Course');
require('dotenv').config();

const seedPack3 = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tai-learning-platform');
    const course = await Course.findOne();
    if (!course) process.exit(1);

    const deadline = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const problems = [
      // GRAPHS
      {
        title: 'Number of Islands',
        course: course._id,
        functionName: 'numIslands',
        difficulty: 'Medium',
        category: 'Graphs',
        points: 30,
        problemStatement: 'Given an m x n 2D binary grid grid which represents a map of 1s (land) and 0s (water), return the number of islands.',
        initialCode: { javascript: 'function numIslands(grid) {\n\n}', python: 'def numIslands(grid):\n    pass' },
        testCases: [{ input: [[["1", "1", "1", "1", "0"], ["1", "1", "0", "1", "0"], ["1", "1", "0", "0", "0"], ["0", "0", "0", "0", "0"]]], expected: 1 }],
        deadline: deadline
      },
      {
        title: 'Clone Graph',
        course: course._id,
        functionName: 'cloneGraph',
        difficulty: 'Medium',
        category: 'Graphs',
        points: 30,
        problemStatement: 'Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph.',
        initialCode: { javascript: 'function cloneGraph(node) {\n\n}', python: 'def cloneGraph(node):\n    pass' },
        testCases: [{ input: [[[2, 4], [1, 3], [2, 4], [1, 3]]], expected: [[2, 4], [1, 3], [2, 4], [1, 3]] }],
        deadline: deadline
      },
      {
        title: 'Pacific Atlantic Water Flow',
        course: course._id,
        functionName: 'pacificAtlantic',
        difficulty: 'Medium',
        category: 'Graphs',
        points: 30,
        problemStatement: 'Find all coordinates where water can flow to both the Pacific and Atlantic oceans.',
        initialCode: { javascript: 'function pacificAtlantic(heights) {\n\n}', python: 'def pacificAtlantic(heights):\n    pass' },
        testCases: [{ input: [[[1, 2, 2, 3, 5], [3, 2, 3, 4, 4], [2, 4, 5, 3, 1], [6, 7, 1, 4, 5], [5, 1, 1, 2, 4]]], expected: [[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]] }],
        deadline: deadline
      },
      // DYNAMIC PROGRAMMING
      {
        title: 'Climbing Stairs',
        course: course._id,
        functionName: 'climbStairs',
        difficulty: 'Easy',
        category: 'Dynamic Programming',
        points: 10,
        problemStatement: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
        initialCode: { javascript: 'function climbStairs(n) {\n\n}', python: 'def climbStairs(n):\n    pass' },
        testCases: [{ input: [2], expected: 2 }, { input: [3], expected: 3 }],
        deadline: deadline
      },
      {
        title: 'Coin Change',
        course: course._id,
        functionName: 'coinChange',
        difficulty: 'Medium',
        category: 'Dynamic Programming',
        points: 30,
        problemStatement: 'Given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money, return the fewest number of coins that you need to make up that amount.',
        initialCode: { javascript: 'function coinChange(coins, amount) {\n\n}', python: 'def coinChange(coins, amount):\n    pass' },
        testCases: [{ input: [[1, 2, 5], 11], expected: 3 }, { input: [[2], 3], expected: -1 }],
        deadline: deadline
      },
      {
        title: 'Longest Increasing Subsequence',
        course: course._id,
        functionName: 'lengthOfLIS',
        difficulty: 'Medium',
        category: 'Dynamic Programming',
        points: 30,
        problemStatement: 'Given an integer array nums, return the length of the longest strictly increasing subsequence.',
        initialCode: { javascript: 'function lengthOfLIS(nums) {\n\n}', python: 'def lengthOfLIS(nums):\n    pass' },
        testCases: [{ input: [[10, 9, 2, 5, 3, 7, 101, 18]], expected: 4 }],
        deadline: deadline
      },
      {
        title: 'Longest Common Subsequence',
        course: course._id,
        functionName: 'longestCommonSubsequence',
        difficulty: 'Medium',
        category: 'Dynamic Programming',
        points: 30,
        problemStatement: 'Given two strings text1 and text2, return the length of their longest common subsequence.',
        initialCode: { javascript: 'function longestCommonSubsequence(text1, text2) {\n\n}', python: 'def longestCommonSubsequence(text1, text2):\n    pass' },
        testCases: [{ input: ["abcde", "ace"], expected: 3 }],
        deadline: deadline
      },
      {
        title: 'Word Break Problem',
        course: course._id,
        functionName: 'wordBreak',
        difficulty: 'Medium',
        category: 'Dynamic Programming',
        points: 30,
        problemStatement: 'Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.',
        initialCode: { javascript: 'function wordBreak(s, wordDict) {\n\n}', python: 'def wordBreak(s, wordDict):\n    pass' },
        testCases: [{ input: ["leetcode", ["leet", "code"]], expected: true }],
        deadline: deadline
      },
      {
        title: 'House Robber',
        course: course._id,
        functionName: 'rob',
        difficulty: 'Medium',
        category: 'Dynamic Programming',
        points: 30,
        problemStatement: 'You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected.',
        initialCode: { javascript: 'function rob(nums) {\n\n}', python: 'def rob(nums):\n    pass' },
        testCases: [{ input: [[1, 2, 3, 1]], expected: 4 }, { input: [[2, 7, 9, 3, 1]], expected: 12 }],
        deadline: deadline
      }
    ];

    const advancedExtra = [];
    for (let i = 0; i < 30; i++) {
      advancedExtra.push({
        title: `Advanced Challenge #${i + 1}`,
        course: course._id,
        functionName: `advSolution${i + 1}`,
        difficulty: i % 3 === 0 ? 'Hard' : 'Medium',
        category: i % 2 === 0 ? 'Dynamic Programming' : 'Graphs',
        points: i % 3 === 0 ? 50 : 30,
        problemStatement: `Push your limits with advanced algorithmic challenge #${i + 1}.`,
        initialCode: { javascript: 'function solution(input) {\n\n}', python: 'def solution(input):\n    pass' },
        testCases: [{ input: [[1]], expected: 1 }],
        deadline: deadline
      });
    }

    // await Assignment.deleteMany({}); // Removed for master seeding
    await Assignment.insertMany([...problems, ...advancedExtra]);
    console.log(`Successfully seeded Pack 3 (${problems.length + advancedExtra.length} Questions)!`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedPack3();
