const mongoose = require('mongoose');

// creating capsule schema
const capsuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  unlockDate: {
    type: Date,
    required: true,
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  images: {
    type: [String],
    default: [],
  },
  isOneTimeView: {
    type: Boolean,
    default: false
  },
  viewed: {
    type: Boolean,
    default: false
  },
  sharableLink: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  }

});

const Capsule = mongoose.model('Capsule', capsuleSchema);
module.exports = Capsule;
