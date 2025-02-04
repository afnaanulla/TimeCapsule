const mongoose = require('mongoose');

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
  content: {  // Ensure this is 'content', not 'textContent'
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
});

const Capsule = mongoose.model('Capsule', capsuleSchema);
module.exports = Capsule;
