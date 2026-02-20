
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const OTComment = require('../models/OTComment');
const OTProgress = require('../models/OTProgress');
const User = require('../models/User');

// @route   GET api/ot-challenge/comments/:day
// @desc    Get comments for a specific day
// @access  Public
router.get('/comments/:day', async (req, res) => {
  try {
    const comments = await OTComment.find({ day: req.params.day }).sort({ timestamp: -1 });
    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/ot-challenge/comments
// @desc    Add a comment
// @access  Private
router.post('/comments', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const newComment = new OTComment({
      text: req.body.text,
      day: req.body.day,
      userName: `${user.firstName} ${user.lastName}`,
      user: req.user.id
    });

    const comment = await newComment.save();
    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/ot-challenge/progress
// @desc    Get current user progress
// @access  Private
router.get('/progress', auth, async (req, res) => {
  try {
    let progress = await OTProgress.findOne({ user: req.user.id });
    if (!progress) {
      progress = new OTProgress({ user: req.user.id, completedDays: [] });
      await progress.save();
    }
    res.json(progress.completedDays);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/ot-challenge/progress
// @desc    Update completed days
// @access  Private
router.post('/progress', auth, async (req, res) => {
  try {
    const { day } = req.body;
    let progress = await OTProgress.findOne({ user: req.user.id });
    
    if (!progress) {
      progress = new OTProgress({ user: req.user.id, completedDays: [day] });
    } else {
        if (progress.completedDays.includes(day)) {
            progress.completedDays = progress.completedDays.filter(d => d !== day);
        } else {
            progress.completedDays.push(day);
        }
    }
    
    await progress.save();
    res.json(progress.completedDays);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
