const express = require('express');
const router = express.Router();
const User = require('../models/user');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


const dotenv = require('dotenv');
dotenv.config();


const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";
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

    // req.session.user = { _id: user._id, username: user.username };
    // await req.session.save();

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

    const token = jwt.sign({ _id: user._id, username: user.username}, SECRET_KEY, { expiresIn: "7d" } );


    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).json({ message: 'Server error' });
  }


});

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const verified = jwt.verify(token.replace('Bearer ', ''), SECRET_KEY);
    req.user = verified; // Store user info in request
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};




router.post('/logout', async(req, res) => {
  try {
    res.status(200).json({ message: 'Logout successfully '});
  }
  catch(err) {
    console.error('Logout error ', err);
    res.status(500).json({ message: 'Internal server error '});
  }
});

module.exports = { router, authenticateToken } ;
