const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');

const validate = require('../middleware/validate');
const schemas = require('../utils/schemas');

// @route    POST api/auth/register
// @desc     Register user
// @access   Public
router.post('/register', validate(schemas.register), async (req, res) => {
  const { name, email, password } = req.body;
  console.log('Register request received:', { name, email });


  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const accessToken = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '7d' });

    user.refreshTokens.push({ token: refreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
    await user.save();

    res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    POST api/auth/login
// @desc     Authenticate user & get tokens
// @access   Public
router.post('/login', validate(schemas.login), async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const accessToken = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '7d' });

    user.refreshTokens.push({ token: refreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
    // Keep only last 5 sessions
    if (user.refreshTokens.length > 5) user.refreshTokens.shift();

    await user.save();

    res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    POST api/auth/refresh
// @desc     Refresh access token
// @access   Public
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id);

    if (!user) return res.status(401).json({ msg: 'User not found' });

    const activeToken = user.refreshTokens.find(t => t.token === refreshToken && t.expiresAt > new Date());
    if (!activeToken) return res.status(401).json({ msg: 'Invalid or expired refresh token' });

    const accessToken = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.json({ accessToken });
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
});

// @route    GET api/auth
// @desc     Get logged in user
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
