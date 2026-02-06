const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @route    POST api/social/google
// @desc     Login/Register with Google
// @access   Public
router.post('/google', async (req, res) => {
  const { idToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        password: Math.random().toString(36).slice(-8), // Temporary random password
        profileImage: picture
      });
      await user.save();
    }

    const accessToken = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '7d' });

    user.refreshTokens.push({ token: refreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
    if (user.refreshTokens.length > 5) user.refreshTokens.shift();
    await user.save();

    res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error('Google Auth Error:', err);
    res.status(500).json({ msg: 'Google Authentication failed' });
  }
});

// @route    POST api/social/github
// @desc     Login/Register with GitHub
// @access   Public
router.post('/github', async (req, res) => {
  const { code } = req.body;

  try {
    const response = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }, {
      headers: { Accept: 'application/json' }
    });

    const { access_token } = response.data;
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `token ${access_token}` }
    });

    const { email, name, avatar_url, login: githubUsername } = userResponse.data;
    const userEmail = email || `${githubUsername}@github.com`; // Fallback for private emails

    let user = await User.findOne({ email: userEmail });

    if (!user) {
      user = new User({
        name: name || githubUsername,
        email: userEmail,
        password: Math.random().toString(36).slice(-8),
        profileImage: avatar_url
      });
      await user.save();
    }

    const accessToken = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '7d' });

    user.refreshTokens.push({ token: refreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
    if (user.refreshTokens.length > 5) user.refreshTokens.shift();
    await user.save();

    res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error('GitHub Auth Error:', err);
    res.status(500).json({ msg: 'GitHub Authentication failed' });
  }
});

module.exports = router;
