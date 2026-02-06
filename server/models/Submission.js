const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'assignment',
    required: true
  },
  code: String,
  language: String,
  status: {
    type: String,
    enum: ['AC', 'WA', 'TLE', 'MLE', 'RTE'],
    required: true
  },
  runtime: Number,
  memory: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('submission', SubmissionSchema);
