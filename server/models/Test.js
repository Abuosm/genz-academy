const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Technical', 'Aptitude', 'HR'],
    required: true
  },
  description: String,
  duration: {
    type: Number, // In minutes
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  questions: [{
    questionText: String,
    options: [String],
    correctAnswer: Number // Index of option
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('test', TestSchema);
