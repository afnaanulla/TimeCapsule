const express = require('express');
const router = express.Router();
const User = require('../models/user');
const nodemailer = require('nodemailer');
const { Subject } = require('rxjs');
const crypto = require('crypto');

//route for register user

router.post('/register', async (req,res) => {
  try{
    const {username, email } = req.body;
    //checking if username is exists or not
    const existsUser = await User.findOne({ $or: [{ username }, { email }] });
    if(existsUser) {
      return res.status(400).json({ message:'Username already exists try another one '});
    }

    const verificationCode = crypto.pseudoRandomBytes(3).toString('hex');

    //creating new user
    const newUser = new User({ username, email, verificationCode });

    //saving the user
    await newUser.save();
    res.status(201).json({ message:'Registered Successful '});
  }
  catch(err) {
    console.error(err);
    res.status(500).json({message:'Internal server error' });
  }
});

//route for login

// Instead of a separate route, you can call the verification code sending inside the login route
router.post('/login', async (req, res) => {
  try {
    console.log('Received login request: ', req.body);
    const { username } = req.body;
    // finding the user by username if exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'User not found. Please register.' });
    }

    const email = user.email;

    if(!user.email) {
      return res.status(400).json({ message:'Email is required for sending the verification code ' });
    }

    // Generate a verification code
    const verificationCode = crypto.randomBytes(3).toString('hex');

    // Update user with the new verification code
    user.verificationCode = verificationCode;
    await user.save();

    console.log('Generated verification code', verificationCode);

    // Configure nodemailer transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Correctly reference environment variables
        pass: process.env.EMAIL_PASS,
      },
    });

    // Prepare the email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email, // Send the email to the registered email
      subject: 'Verification code',
      text: `Your verification code is ${verificationCode}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending mail:', err); // Log the error for debugging
        return res.status(500).json({ message: 'Error sending verification email' });
      }
      console.log('Email sent:', info.response); // Optional: Log successful email send
      return res.status(200).json({ message: 'Code sent to your email' });
    });
  } catch (err) {
    console.error('Error in /login route:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to send email
function sendVerificationEmail(email, code) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verification Code',
    text: `Your verification code is ${code}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Error sending verification email', err);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}


router.post('/verify-code', async(req, res) => {
  try{
    const { username, code } = req.body;

    //finding user by username
    const user = await User.findOne({ username });
    if(!user) {
      return res.status(400).json({ message: 'User not found '});
    }
    if(user.verificationCode !== code) {
      return res.status(400).json({ message: 'Invalid verification code '});
    }
    res.status(200).json({ message: 'Login successful '});
  }
  catch(err) {
    console.error('Error during verification: ', err);
    res.status(500).json({ message: 'Server error '});
  }
});

module.exports = router;
