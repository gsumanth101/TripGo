const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const secret = 'mysecretkey'; // Use an environment variable for the secret key

// Register route
router.post('/register', async (req, res) => {
  const { name,username,email,phone_number, password } = req.body;
  try {
    const newUser = new User({ name,username,email,phone_number, password});
    await newUser.save();
    res.redirect('/auth/login');
  } catch (err) {
    res.status(500).send('Error registering user');
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send('User not found');
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).send('Invalid password');
    }
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).send('Error logging in');
  }
});

// Login form
router.get('/login', (req, res) => {
  res.render('login');
});

// Register form
router.get('/register', (req, res) => {
  res.render('register');
});

module.exports = router;
