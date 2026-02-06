const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  logo: {
    type: String, // URL or local path
    required: true
  },
  tags: {
    type: [String], // e.g., ["Core Java", "Programming"]
    default: []
  },
  interviewRounds: [{
    roundName: String, // e.g., "Aptitude", "Technical Round 1"
    questions: [String] // List of questions
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('company', CompanySchema);
