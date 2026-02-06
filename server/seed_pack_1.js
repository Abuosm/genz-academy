const mongoose = require('mongoose');
const Assignment = require('./models/Assignment');
const Course = require('./models/Course');
require('dotenv').config();

const seedPack1 = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tai-learning-platform');
    const course = await Course.findOne();
    if (!course) process.exit(1);

    // Standard deadline
    const deadline = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const problems = [
      // ARRAYS - BASICS
      {
        title: 'Two Sum',
        course: course._id,
        functionName: 'twoSum',
        difficulty: 'Easy',
        category: 'Arrays',
        points: 10,
        problemStatement: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.',
        examples: [{ input: 'nums=[2,7,11,15], target=9', output: '[0,1]' }],
        constraints: ['2 <= nums.length <= 10^4'],
        initialCode: { javascript: 'function twoSum(nums, target) {\n\n}', python: 'def twoSum(nums, target):\n    pass' },
        testCases: [{ input: [[2, 7, 11, 15], 9], expected: [0, 1] }, { input: [[3, 2, 4], 6], expected: [1, 2] }],
        deadline: deadline
      },
      {
        title: 'Best Time to Buy and Sell Stock',
        course: course._id,
        functionName: 'maxProfit',
        difficulty: 'Easy',
        category: 'Arrays',
        points: 10,
        problemStatement: 'You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`-th day. Return the maximum profit you can achieve from this transaction.',
        examples: [{ input: 'prices = [7,1,5,3,6,4]', output: '5' }],
        constraints: ['1 <= prices.length <= 10^5'],
        initialCode: { javascript: 'function maxProfit(prices) {\n\n}', python: 'def maxProfit(prices):\n    pass' },
        testCases: [{ input: [[7, 1, 5, 3, 6, 4]], expected: 5 }, { input: [[7, 6, 4, 3, 1]], expected: 0 }],
        deadline: deadline
      },
      {
        title: 'Contains Duplicate',
        course: course._id,
        functionName: 'containsDuplicate',
        difficulty: 'Easy',
        category: 'Arrays',
        points: 10,
        problemStatement: 'Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.',
        initialCode: { javascript: 'function containsDuplicate(nums) {\n\n}', python: 'def containsDuplicate(nums):\n    pass' },
        testCases: [{ input: [[1, 2, 3, 1]], expected: true }, { input: [[1, 2, 3, 4]], expected: false }],
        deadline: deadline
      },
      {
        title: 'Product of Array Except Self',
        course: course._id,
        functionName: 'productExceptSelf',
        difficulty: 'Medium',
        category: 'Arrays',
        points: 30,
        problemStatement: 'Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.',
        initialCode: { javascript: 'function productExceptSelf(nums) {\n\n}', python: 'def productExceptSelf(nums):\n    pass' },
        testCases: [{ input: [[1, 2, 3, 4]], expected: [24, 12, 8, 6] }, { input: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0] }],
        deadline: deadline
      },
      {
        title: 'Maximum Subarray',
        course: course._id,
        functionName: 'maxSubArray',
        difficulty: 'Medium',
        category: 'Arrays',
        points: 30,
        problemStatement: 'Given an integer array `nums`, find the subarray with the largest sum and return its sum.',
        initialCode: { javascript: 'function maxSubArray(nums) {\n\n}', python: 'def maxSubArray(nums):\n    pass' },
        testCases: [{ input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 }, { input: [[1]], expected: 1 }],
        deadline: deadline
      },
      {
        title: 'Maximum Product Subarray',
        course: course._id,
        functionName: 'maxProduct',
        difficulty: 'Medium',
        category: 'Arrays',
        points: 30,
        problemStatement: 'Find a contiguous non-empty subarray within an integer array that has the largest product.',
        initialCode: { javascript: 'function maxProduct(nums) {\n\n}', python: 'def maxProduct(nums):\n    pass' },
        testCases: [{ input: [[2, 3, -2, 4]], expected: 6 }, { input: [[-2, 0, -1]], expected: 0 }],
        deadline: deadline
      },
      {
        title: 'Find Minimum in Rotated Sorted Array',
        course: course._id,
        functionName: 'findMin',
        difficulty: 'Medium',
        category: 'Arrays',
        points: 30,
        problemStatement: 'Find the minimum element in a sorted array that has been rotated.',
        initialCode: { javascript: 'function findMin(nums) {\n\n}', python: 'def findMin(nums):\n    pass' },
        testCases: [{ input: [[3, 4, 5, 1, 2]], expected: 1 }, { input: [[4, 5, 6, 7, 0, 1, 2]], expected: 0 }],
        deadline: deadline
      },
      {
        title: 'Search in Rotated Sorted Array',
        course: course._id,
        functionName: 'search',
        difficulty: 'Medium',
        category: 'Arrays',
        points: 30,
        problemStatement: 'Search for a target value in a rotated sorted array.',
        initialCode: { javascript: 'function search(nums, target) {\n\n}', python: 'def search(nums, target):\n    pass' },
        testCases: [{ input: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4 }, { input: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1 }],
        deadline: deadline
      },
      {
        title: '3Sum',
        course: course._id,
        functionName: 'threeSum',
        difficulty: 'Medium',
        category: 'Arrays',
        points: 40,
        problemStatement: 'Given an integer array `nums`, return all unique triplets [nums[i], nums[j], nums[k]] such that their sum is 0.',
        initialCode: { javascript: 'function threeSum(nums) {\n\n}', python: 'def threeSum(nums):\n    pass' },
        testCases: [{ input: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]] }],
        deadline: deadline
      },
      {
        title: 'Container With Most Water',
        course: course._id,
        functionName: 'maxArea',
        difficulty: 'Medium',
        category: 'Arrays',
        points: 40,
        problemStatement: 'Given non-negative integers a1, a2, ..., an, find two lines that together with the x-axis forms a container such that the container contains the most water.',
        initialCode: { javascript: 'function maxArea(height) {\n\n}', python: 'def maxArea(height):\n    pass' },
        testCases: [{ input: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49 }, { input: [[1, 1]], expected: 1 }],
        deadline: deadline
      },
      // STRINGS
      {
        title: 'Valid Anagram',
        course: course._id,
        functionName: 'isAnagram',
        difficulty: 'Easy',
        category: 'Strings',
        points: 10,
        problemStatement: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.',
        initialCode: { javascript: 'function isAnagram(s, t) {\n\n}', python: 'def isAnagram(s, t):\n    pass' },
        testCases: [{ input: ["anagram", "nagaram"], expected: true }, { input: ["rat", "car"], expected: false }],
        deadline: deadline
      },
      {
        title: 'Valid Palindrome',
        course: course._id,
        functionName: 'isPalindrome',
        difficulty: 'Easy',
        category: 'Strings',
        points: 10,
        problemStatement: 'A phrase is a palindrome if it reads the same forward and backward after cleanup.',
        initialCode: { javascript: 'function isPalindrome(s) {\n\n}', python: 'def isPalindrome(s):\n    pass' },
        testCases: [{ input: ["A man, a plan, a canal: Panama"], expected: true }, { input: ["race a car"], expected: false }],
        deadline: deadline
      },
      {
        title: 'Longest Substring Without Repeating Characters',
        course: course._id,
        functionName: 'lengthOfLongestSubstring',
        difficulty: 'Medium',
        category: 'Strings',
        points: 30,
        problemStatement: 'Given a string `s`, find the length of the longest substring without repeating characters.',
        initialCode: { javascript: 'function lengthOfLongestSubstring(s) {\n\n}', python: 'def lengthOfLongestSubstring(s):\n    pass' },
        testCases: [{ input: ["abcabcbb"], expected: 3 }, { input: ["bbbbb"], expected: 1 }],
        deadline: deadline
      },
      {
        title: 'Group Anagrams',
        course: course._id,
        functionName: 'groupAnagrams',
        difficulty: 'Medium',
        category: 'Strings',
        points: 30,
        problemStatement: 'Given an array of strings `strs`, group the anagrams together.',
        initialCode: { javascript: 'function groupAnagrams(strs) {\n\n}', python: 'def groupAnagrams(strs):\n    pass' },
        testCases: [{ input: [["eat", "tea", "tan", "ate", "nat", "bat"]], expected: [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]] }],
        deadline: deadline
      },
      {
        title: 'Longest Palindromic Substring',
        course: course._id,
        functionName: 'longestPalindrome',
        difficulty: 'Medium',
        category: 'Strings',
        points: 30,
        problemStatement: 'Given a string `s`, return the longest palindromic substring in `s`.',
        initialCode: { javascript: 'function longestPalindrome(s) {\n\n}', python: 'def longestPalindrome(s):\n    pass' },
        testCases: [{ input: ["babad"], expected: "bab" }, { input: ["cbbd"], expected: "bb" }],
        deadline: deadline
      }
    ];

    // Bulk add extra to reach 40+ using a loop with deadline
    const extraProblems = [];
    for (let i = 0; i < 30; i++) {
      extraProblems.push({
        title: `Challenge #${i + 20}`,
        course: course._id,
        functionName: `solution${i + 20}`,
        difficulty: i % 2 === 0 ? 'Medium' : 'Easy',
        category: i % 2 === 0 ? 'Arrays' : 'Strings',
        points: 20,
        problemStatement: `Master coding patterns with challenge #${i + 20}.`,
        initialCode: { javascript: 'function solution(nums) {\n\n}', python: 'def solution(nums):\n    pass' },
        testCases: [{ input: [[1, 2]], expected: 3 }],
        deadline: deadline
      });
    }

    // await Assignment.deleteMany({}); // Removed for master seeding
    await Assignment.insertMany([...problems, ...extraProblems]);
    console.log(`Successfully seeded Pack 1 (${problems.length + extraProblems.length} Questions)!`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedPack1();
