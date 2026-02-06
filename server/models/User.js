const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  bookmarks: [{
    type: { type: String, enum: ['course', 'company', 'job', 'question'] },
    item: { type: mongoose.Schema.Types.ObjectId, refPath: 'bookmarks.type' }
  }],
  // Personal Information
  whatsapp: String,
  parentMobile: String,
  instagram: String,
  linkedin: String,
  dob: Date,
  gender: String,
  currentCity: String,
  currentState: String,
  nativeState: String,
  bio: String,

  // Profile & Stats
  employabilityScore: {
    type: Number,
    default: 35
  },
  assignmentsCompleted: {
    type: Number,
    default: 0
  },
  favoriteCompanies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  }],
  leaderboardPoints: {
    type: Number,
    default: 100
  },
  profileImage: {
    type: String,
    default: ''
  },
  totalSubmissions: {
    type: Number,
    default: 0
  },
  correctSubmissions: {
    type: Number,
    default: 0
  },
  accuracy: {
    type: Number,
    default: 0
  },

  // Education
  education: [{
    degree: String,
    institution: String,
    year: String,
    grade: String
  }],

  // Projects
  projects: [{
    title: String,
    description: String,
    technologies: [String],
    link: String,
    startDate: Date,
    endDate: Date
  }],

  // Certificates
  certificates: [{
    name: String,
    issuer: String,
    issueDate: Date,
    link: String
  }],
  solvedAssignments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'assignment'
  }],
  refreshTokens: [{
    token: String,
    createdAt: { type: Date, default: Date.now },
    expiresAt: Date
  }],
  currentStreak: {
    type: Number,
    default: 0
  },
  lastSolvedDate: {
    type: Date
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('user', UserSchema);
