const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET api/profile
// @desc    Get current user's profile
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error fetching profile:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   PUT api/profile
// @desc    Update user profile
// @access  Private
router.put('/', auth, async (req, res) => {
  try {
    const {
      name,
      whatsapp,
      parentMobile,
      instagram,
      linkedin,
      dob,
      gender,
      currentCity,
      currentState,
      nativeState,
      bio,
      profileImage,
      education,
      projects,
      certificates
    } = req.body;

    // Build profile object
    const profileFields = {};
    if (name) profileFields.name = name;
    if (whatsapp) profileFields.whatsapp = whatsapp;
    if (parentMobile) profileFields.parentMobile = parentMobile;
    if (instagram) profileFields.instagram = instagram;
    if (linkedin) profileFields.linkedin = linkedin;
    if (dob) profileFields.dob = dob;
    if (gender) profileFields.gender = gender;
    if (currentCity) profileFields.currentCity = currentCity;
    if (currentState) profileFields.currentState = currentState;
    if (nativeState) profileFields.nativeState = nativeState;
    if (bio) profileFields.bio = bio;
    if (profileImage) profileFields.profileImage = profileImage;
    if (education) profileFields.education = education;
    if (projects) profileFields.projects = projects;
    if (certificates) profileFields.certificates = certificates;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error('Error updating profile:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
