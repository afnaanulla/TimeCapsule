const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: {type: String, required: true, unique: true},
  code: { type: String },
  verificationCode: { type: String, required: false },
});

module.exports = mongoose.model('User', UserSchema);
