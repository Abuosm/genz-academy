const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'course',
    required: true
  },
  description: String,
  problemStatement: String, // MarkDown content
  functionName: String, // The function name the solver must implement
  testCases: [{
    input: mongoose.Schema.Types.Mixed,
    expected: mongoose.Schema.Types.Mixed,
    isPublic: { type: Boolean, default: true }
  }],
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  constraints: [String],
  initialCode: {
    javascript: { type: String, default: '// Write your code here\nfunction solution() {\n\n}' },
    python: { type: String, default: '# Write your code here\ndef solution():\n    pass' }
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  },
  category: {
    type: String,
    default: 'General'
  },
  deadline: {
    type: Date,
    required: true
  },
  points: {
    type: Number,
    default: 10
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('assignment', AssignmentSchema);
