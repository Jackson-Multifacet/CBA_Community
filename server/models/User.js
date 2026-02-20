
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Member', 'Partner', 'Leader', 'Pastor'],
    default: 'Member',
  },
  avatarUrl: String,
  parish: String,
  campus: String,
  spiritualInfo: {
    isBaptized: { type: Boolean, default: false },
    ministryInterests: [String]
  },
  memberSince: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);
