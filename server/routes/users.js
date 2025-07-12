const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Item = require('../models/Item');
const { auth } = require('../middleware/auth');
const { uploadSingle, getFileUrl } = require('../middleware/upload');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({ user: req.user.getPublicProfile() });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, uploadSingle('profileImage'), [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('phone').optional().matches(/^[0-9]{8,15}$/).withMessage('Please provide a valid phone number'),
  body('bio').optional().isLength({ max: 500 }).withMessage('Bio must be less than 500 characters'),
  body('location.province').optional().notEmpty().withMessage('Province is required'),
  body('location.city').optional().notEmpty().withMessage('City is required'),
  body('location.district').optional().notEmpty().withMessage('District is required'),
  body('location.address').optional().notEmpty().withMessage('Address is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone, bio, location } = req.body;
    const updateFields = {};

    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;
    if (bio) updateFields.bio = bio;
    if (location) updateFields.location = JSON.parse(location);

    // Handle profile image upload
    if (req.file) {
      updateFields.profileImage = getFileUrl(req, req.file.filename, 'profiles');
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Profile updated successfully',
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Phone number already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID (public profile)
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -emailVerificationToken -resetPasswordToken -resetPasswordExpires -idCard.idNumber');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: user.getPublicProfile() });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/users/:id/items
// @desc    Get user's items
// @access  Public
router.get('/:id/items', async (req, res) => {
  try {
    const { page = 1, limit = 20, status = 'Active' } = req.query;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const query = { seller: req.params.id };
    if (status) {
      query.status = status;
    }

    const items = await Item.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('category', 'name icon')
      .select('-inquiries -reportCount -adminNotes');

    const total = await Item.countDocuments(query);

    res.json({
      items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get user items error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/users/my/items
// @desc    Get current user's items
// @access  Private
router.get('/my/items', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const query = { seller: req.user._id };
    if (status) {
      query.status = status;
    }

    const items = await Item.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('category', 'name icon');

    const total = await Item.countDocuments(query);

    res.json({
      items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get my items error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/users/my/favorites
// @desc    Get current user's favorite items
// @access  Private
router.get('/my/favorites', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const items = await Item.find({
      favorites: req.user._id,
      status: 'Active'
    })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('seller', 'name profileImage location rating')
      .populate('category', 'name icon')
      .select('-inquiries -reportCount -adminNotes');

    const total = await Item.countDocuments({
      favorites: req.user._id,
      status: 'Active'
    });

    res.json({
      items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/users/my/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get('/my/dashboard', auth, async (req, res) => {
  try {
    // Get user's item statistics
    const totalItems = await Item.countDocuments({ seller: req.user._id });
    const activeItems = await Item.countDocuments({ seller: req.user._id, status: 'Active' });
    const soldItems = await Item.countDocuments({ seller: req.user._id, status: 'Sold' });
    const totalViews = await Item.aggregate([
      { $match: { seller: req.user._id } },
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);

    // Get recent items
    const recentItems = await Item.find({ seller: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('category', 'name icon')
      .select('title images price status views favoriteCount createdAt');

    // Get favorite items count
    const favoritesCount = await Item.countDocuments({
      favorites: req.user._id,
      status: 'Active'
    });

    res.json({
      stats: {
        totalItems,
        activeItems,
        soldItems,
        totalViews: totalViews[0]?.totalViews || 0,
        favoritesCount
      },
      recentItems
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/users/account
// @desc    Delete user account
// @access  Private
router.delete('/account', auth, [
  body('password').notEmpty().withMessage('Password is required to delete account')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { password } = req.body;

    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Check if user has active items
    const activeItems = await Item.countDocuments({ seller: req.user._id, status: 'Active' });
    if (activeItems > 0) {
      return res.status(400).json({ 
        error: 'Please delete or mark all your active items as sold before deleting your account' 
      });
    }

    // Deactivate account instead of deleting
    await User.findByIdAndUpdate(req.user._id, { isActive: false });

    res.json({ message: 'Account deactivated successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;