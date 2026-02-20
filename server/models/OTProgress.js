
const mongoose = require('mongoose');

const OTProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  completedDays: {
    type: [Number],
    default: []
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('OTProgress', OTProgressSchema);
