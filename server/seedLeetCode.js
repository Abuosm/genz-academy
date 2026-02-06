const mongoose = require('mongoose');
const Assignment = require('./models/Assignment');
const Course = require('./models/Course');
require('dotenv').config();

const seedLeetCodeData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tai-learning-platform');
    console.log('Connected to MongoDB');

    const course = await Course.findOne();
    if (!course) {
      console.log('No course found. Please seed courses first.');
      process.exit(1);
    }

    // await Assignment.deleteMany({}); // Removed for master seeding

    const leetcodeProblems = [
      {
        title: 'Two Sum',
        course: course._id,
        functionName: 'twoSum',
        description: 'Find two numbers that add up to a specific target.',
        problemStatement: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.',
        examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: '2 + 7 = 9' }],
        constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'],
        difficulty: 'Easy',
        category: 'Arrays',
        points: 10,
        initialCode: {
          javascript: 'function twoSum(nums, target) {\n    const map = new Map();\n    for(let i=0; i<nums.length; i++) {\n        const complement = target - nums[i];\n        if(map.has(complement)) return [map.get(complement), i];\n        map.set(nums[i], i);\n    }\n}',
          python: 'def twoSum(nums, target):\n    prevMap = {} # val : index\n    for i, n in enumerate(nums):\n        diff = target - n\n        if diff in prevMap:\n            return [prevMap[diff], i]\n        prevMap[n] = i'
        },
        testCases: [
          { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
          { input: [[3, 2, 4], 6], expected: [1, 2] },
          { input: [[3, 3], 6], expected: [0, 1] }
        ],
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Palindrome Number',
        course: course._id,
        functionName: 'isPalindrome',
        description: 'Determine if an integer is a palindrome.',
        problemStatement: 'Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise.',
        examples: [{ input: 'x = 121', output: 'true' }],
        constraints: ['-2^31 <= x <= 2^31 - 1'],
        difficulty: 'Easy',
        category: 'Math',
        points: 10,
        initialCode: {
          javascript: 'function isPalindrome(x) {\n    if (x < 0) return false;\n    let rev = 0, temp = x;\n    while (temp > 0) {\n        rev = rev * 10 + (temp % 10);\n        temp = Math.floor(temp / 10);\n    }\n    return rev === x;\n}',
          python: 'def isPalindrome(x):\n    if x < 0: return False\n    return str(x) == str(x)[::-1]'
        },
        testCases: [
          { input: [121], expected: true },
          { input: [-121], expected: false },
          { input: [10], expected: false }
        ],
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Valid Parentheses',
        course: course._id,
        functionName: 'isValid',
        description: 'Validate parentheses in a string.',
        problemStatement: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.',
        examples: [{ input: 's = "()"', output: 'true' }],
        constraints: ['1 <= s.length <= 10^4'],
        difficulty: 'Easy',
        category: 'Stacks',
        points: 10,
        initialCode: {
          javascript: 'function isValid(s) {\n    const stack = [];\n    const map = { ")": "(", "}": "{", "]": "[" };\n    for (let char of s) {\n        if (map[char]) {\n            if (stack.pop() !== map[char]) return false;\n        } else {\n            stack.push(char);\n        }\n    }\n    return stack.length === 0;\n}',
          python: 'def isValid(s):\n    stack = []\n    closeToOpen = { ")": "(", "]": "[", "}": "{" }\n    for c in s:\n        if c in closeToOpen:\n            if stack and stack[-1] == closeToOpen[c]:\n                stack.pop()\n            else:\n                return False\n        else:\n            stack.append(c)\n    return True if not stack else False'
        },
        testCases: [
          { input: ["()"], expected: true },
          { input: ["()[]{}"], expected: true },
          { input: ["(]"], expected: false }
        ],
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Maximum Subarray',
        course: course._id,
        functionName: 'maxSubArray',
        description: 'Find the contiguous subarray with the largest sum.',
        problemStatement: 'Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
        examples: [{ input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6' }],
        constraints: ['1 <= nums.length <= 10^5'],
        difficulty: 'Medium',
        category: 'Dynamic Programming',
        points: 30,
        initialCode: {
          javascript: 'function maxSubArray(nums) {\n    let maxSum = nums[0];\n    let curSum = 0;\n    for (let n of nums) {\n        if (curSum < 0) curSum = 0;\n        curSum += n;\n        maxSum = Math.max(maxSum, curSum);\n    }\n    return maxSum;\n}',
          python: 'def maxSubArray(nums):\n    res = nums[0]\n    total = 0\n    for n in nums:\n        total += n\n        res = max(res, total)\n        if total < 0:\n            total = 0\n    return res'
        },
        testCases: [
          { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
          { input: [[1]], expected: 1 },
          { input: [[5, 4, -1, 7, 8]], expected: 23 }
        ],
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Reverse Linked List',
        course: course._id,
        functionName: 'reverseList',
        description: 'Reverse a singly linked list.',
        problemStatement: 'Given the `head` of a singly linked list, reverse the list, and return the reversed list (represented as an array for testing).',
        examples: [{ input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' }],
        difficulty: 'Easy',
        category: 'Linked List',
        points: 10,
        initialCode: {
          javascript: 'function reverseList(head) {\n    return head.reverse();\n}',
          python: 'def reverseList(head):\n    return head[::-1]'
        },
        testCases: [
          { input: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] },
          { input: [[1, 2]], expected: [2, 1] }
        ],
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Valid Anagram',
        course: course._id,
        functionName: 'isAnagram',
        description: 'Determine if t is an anagram of s.',
        problemStatement: 'Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.',
        examples: [{ input: 's = "anagram", t = "nagaram"', output: 'true' }],
        difficulty: 'Easy',
        category: 'Strings',
        points: 10,
        initialCode: {
          javascript: 'function isAnagram(s, t) {\n    if (s.length !== t.length) return false;\n    return s.split("").sort().join("") === t.split("").sort().join("");\n}',
          python: 'def isAnagram(s, t):\n    return sorted(s) == sorted(t)'
        },
        testCases: [
          { input: ["anagram", "nagaram"], expected: true },
          { input: ["rat", "car"], expected: false }
        ],
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    ];

    await Assignment.insertMany(leetcodeProblems);
    console.log('Successfully seeded multi-language problems!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seedLeetCodeData();
