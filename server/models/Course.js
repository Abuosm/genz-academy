const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  duration: {
    type: String, // e.g., "10:30"
    required: true
  }
});

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  instructor: {
    type: String,
    required: true
  },
  duration: {
    type: String, // e.g., "10h 30m"
    required: true
  },
  modulesCount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  modules: [ModuleSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('course', CourseSchema);
