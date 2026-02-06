const mongoose = require('mongoose');
const Assignment = require('./models/Assignment');
const Course = require('./models/Course');
require('dotenv').config();

const seedPack2 = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tai-learning-platform');
    const course = await Course.findOne();
    if (!course) process.exit(1);

    const deadline = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const problems = [
      // LINKED LISTS
      {
        title: 'Reverse Linked List',
        course: course._id,
        functionName: 'reverseList',
        difficulty: 'Easy',
        category: 'Linked List',
        points: 10,
        problemStatement: 'Reverse a singly linked list and return the head (array representation).',
        initialCode: { javascript: 'function reverseList(head) {\n\n}', python: 'def reverseList(head):\n    pass' },
        testCases: [{ input: [[1, 2, 3]], expected: [3, 2, 1] }],
        deadline: deadline
      },
      {
        title: 'Linked List Cycle',
        course: course._id,
        functionName: 'hasCycle',
        difficulty: 'Easy',
        category: 'Linked List',
        points: 10,
        problemStatement: 'Determine if a linked list has a cycle in it.',
        initialCode: { javascript: 'function hasCycle(head) {\n\n}', python: 'def hasCycle(head):\n    pass' },
        testCases: [{ input: [[3, 2, 0, -4], 1], expected: true }, { input: [[1, 2], -1], expected: false }],
        deadline: deadline
      },
      {
        title: 'Merge Two Sorted Lists',
        course: course._id,
        functionName: 'mergeTwoLists',
        difficulty: 'Easy',
        category: 'Linked List',
        points: 10,
        problemStatement: 'Merge two sorted linked lists.',
        initialCode: { javascript: 'function mergeTwoLists(l1, l2) {\n\n}', python: 'def mergeTwoLists(l1, l2):\n    pass' },
        testCases: [{ input: [[1, 2, 4], [1, 3, 4]], expected: [1, 1, 2, 3, 4, 4] }],
        deadline: deadline
      },
      {
        title: 'Remove Nth Node From End of List',
        course: course._id,
        functionName: 'removeNthFromEnd',
        difficulty: 'Medium',
        category: 'Linked List',
        points: 30,
        problemStatement: 'Remove the nth node from the end of the list.',
        initialCode: { javascript: 'function removeNthFromEnd(head, n) {\n\n}', python: 'def removeNthFromEnd(head, n):\n    pass' },
        testCases: [{ input: [[1, 2, 3, 4, 5], 2], expected: [1, 2, 3, 5] }],
        deadline: deadline
      },
      {
        title: 'Reorder List',
        course: course._id,
        functionName: 'reorderList',
        difficulty: 'Medium',
        category: 'Linked List',
        points: 30,
        problemStatement: 'Reorder the list such that L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → ...',
        initialCode: { javascript: 'function reorderList(head) {\n\n}', python: 'def reorderList(head):\n    pass' },
        testCases: [{ input: [[1, 2, 3, 4]], expected: [1, 4, 2, 3] }],
        deadline: deadline
      },
      // TREES
      {
        title: 'Invert Binary Tree',
        course: course._id,
        functionName: 'invertTree',
        difficulty: 'Easy',
        category: 'Trees',
        points: 10,
        problemStatement: 'Given the root of a binary tree, invert the tree.',
        initialCode: { javascript: 'function invertTree(root) {\n\n}', python: 'def invertTree(root):\n    pass' },
        testCases: [{ input: [[4, 2, 7, 1, 3, 6, 9]], expected: [4, 7, 2, 9, 6, 3, 1] }],
        deadline: deadline
      },
      {
        title: 'Maximum Depth of Binary Tree',
        course: course._id,
        functionName: 'maxDepth',
        difficulty: 'Easy',
        category: 'Trees',
        points: 10,
        problemStatement: 'Return the maximum depth of a binary tree.',
        initialCode: { javascript: 'function maxDepth(root) {\n\n}', python: 'def maxDepth(root):\n    pass' },
        testCases: [{ input: [[3, 9, 20, null, null, 15, 7]], expected: 3 }],
        deadline: deadline
      },
      {
        title: 'Same Tree',
        course: course._id,
        functionName: 'isSameTree',
        difficulty: 'Easy',
        category: 'Trees',
        points: 10,
        problemStatement: 'Check if two binary trees are exactly the same.',
        initialCode: { javascript: 'function isSameTree(p, q) {\n\n}', python: 'def isSameTree(p, q):\n    pass' },
        testCases: [{ input: [[1, 2, 3], [1, 2, 3]], expected: true }, { input: [[1, 2], [1, null, 2]], expected: false }],
        deadline: deadline
      },
      {
        title: 'Subtree of Another Tree',
        course: course._id,
        functionName: 'isSubtree',
        difficulty: 'Easy',
        category: 'Trees',
        points: 10,
        problemStatement: 'Given the roots of two binary trees root and subRoot, return true if there is a subtree of root with the same structure and node values of subRoot.',
        initialCode: { javascript: 'function isSubtree(root, subRoot) {\n\n}', python: 'def isSubtree(root, subRoot):\n    pass' },
        testCases: [{ input: [[3, 4, 5, 1, 2], [4, 1, 2]], expected: true }],
        deadline: deadline
      },
      {
        title: 'Binary Tree Level Order Traversal',
        course: course._id,
        functionName: 'levelOrder',
        difficulty: 'Medium',
        category: 'Trees',
        points: 30,
        problemStatement: 'Return the level order traversal of its nodes\' values.',
        initialCode: { javascript: 'function levelOrder(root) {\n\n}', python: 'def levelOrder(root):\n    pass' },
        testCases: [{ input: [[3, 9, 20, null, null, 15, 7]], expected: [[3], [9, 20], [15, 7]] }],
        deadline: deadline
      }
    ];

    const structuralExtra = [];
    for (let i = 0; i < 25; i++) {
      structuralExtra.push({
        title: `Structural Challenge #${i + 15}`,
        course: course._id,
        functionName: `structSolution${i + 15}`,
        difficulty: i % 2 === 0 ? 'Medium' : 'Hard',
        category: i % 3 === 0 ? 'Linked List' : (i % 3 === 1 ? 'Trees' : 'Stacks'),
        points: 30,
        problemStatement: `Advance your understanding of data structures with challenge #${i + 15}.`,
        initialCode: { javascript: 'function solution(data) {\n\n}', python: 'def solution(data):\n    pass' },
        testCases: [{ input: [[1]], expected: 1 }],
        deadline: deadline
      });
    }

    await Assignment.insertMany([...problems, ...structuralExtra]);
    console.log(`Successfully seeded Pack 2 (${problems.length + structuralExtra.length} Questions)!`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedPack2();
