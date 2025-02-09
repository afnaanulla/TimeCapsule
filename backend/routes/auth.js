const express = require('express');
const router = express.Router();
const User = require('../models/user');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// register user
router.post('/register', async (req, res) => {
  try {
    const { username, email } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const verificationCode = crypto.randomBytes(3).toString('hex');

    const newUser = new User({ username, email, verificationCode });
    await newUser.save();

    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// login user (send verification code)
router.post('/login', async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: 'User not found. Please register.' });
    }

    const verificationCode = crypto.randomBytes(3).toString('hex');
    user.verificationCode = verificationCode;
    await user.save();

    req.session.user = { _id: user._id, username: user.username };
    await req.session.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Verification Code',
      text: `Your verification code is ${verificationCode}`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error('Error sending email:', err);
        return res.status(500).json({ message: 'Error sending verification email' });
      }
      res.status(200).json({ message: 'Verification code sent to email' });
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// verify code
router.post('/verify-code', async (req, res) => {
  try {
    const { username, code } = req.body;
    const user = await User.findOne({ username });

    if (!user || user.verificationCode !== code) {
      return res.status(400).json({ message: 'Invalid username or verification code' });
    }
    req.session.user = {_id: user._id, username: user.username };
    await req.session.save();

    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/logout', async(req, res) => {
  try{
    req.session.destroy((err) => {
      if(err) {
        return res.status(500).json({ message: 'Error destroying session '});
      }
      res.status(200).json({ message: 'Logout successfully '});
    });
  }
  catch(err) {
    console.error('Logout error ', err);
    res.status(500).json({ message: 'Internal server error '});
  }
});

module.exports = router;
