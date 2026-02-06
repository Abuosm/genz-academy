const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  logo: String,
  location: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Full-time', 'Internship', 'Contract'],
    default: 'Full-time'
  },
  salary: String,
  description: {
    type: String,
    required: true
  },
  requirements: [String],
  link: {
    type: String,
    required: true
  },
  postedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('job', JobSchema);
