const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Item = require('../models/Item');
const Category = require('../models/Category');
const Report = require('../models/Report');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/admin/stats
// @desc    Get admin dashboard stats
// @access  Admin
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const verifiedUsers = await User.countDocuments({ 'idCard.verified': true });
    
    const totalItems = await Item.countDocuments();
    const activeItems = await Item.countDocuments({ status: 'Active' });
    const soldItems = await Item.countDocuments({ status: 'Sold' });
    
    const totalReports = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'pending' });
    
    const totalCategories = await Category.countDocuments();
    
    res.json({
      users: {
        total: totalUsers,
        active: activeUsers,
        verified: verifiedUsers
      },
      items: {
        total: totalItems,
        active: activeItems,
        sold: soldItems
      },
      reports: {
        total: totalReports,
        pending: pendingReports
      },
      categories: {
        total: totalCategories
      }
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users for admin
// @access  Admin
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, verified, active } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (verified !== undefined) {
      query['idCard.verified'] = verified === 'true';
    }
    
    if (active !== undefined) {
      query.isActive = active === 'true';
    }
    
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-password -emailVerificationToken -resetPasswordToken -resetPasswordExpires');
    
    const total = await User.countDocuments(query);
    
    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/admin/users/:id/verify
// @desc    Verify user ID
// @access  Admin
router.put('/users/:id/verify', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.idCard.verified = true;
    await user.save();
    
    res.json({ message: 'User verified successfully' });
  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/admin/users/:id/suspend
// @desc    Suspend/unsuspend user
// @access  Admin
router.put('/users/:id/suspend', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.isActive = !user.isActive;
    await user.save();
    
    res.json({ 
      message: user.isActive ? 'User unsuspended successfully' : 'User suspended successfully' 
    });
  } catch (error) {
    console.error('Suspend user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/admin/reports
// @desc    Get all reports
// @access  Admin
router.get('/reports', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, reportType } = req.query;
    
    const query = {};
    if (status) {
      query.status = status;
    }
    if (reportType) {
      query.reportType = reportType;
    }
    
    const reports = await Report.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('reporter', 'name email')
      .populate('targetItem', 'title images seller')
      .populate('targetUser', 'name email')
      .populate('resolvedBy', 'name');
    
    const total = await Report.countDocuments(query);
    
    res.json({
      reports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/admin/reports/:id/resolve
// @desc    Resolve report
// @access  Admin
router.put('/reports/:id/resolve', adminAuth, [
  body('action').isIn(['no_action', 'warning', 'content_removed', 'user_suspended', 'user_banned']).withMessage('Invalid action'),
  body('adminNotes').optional().isLength({ max: 1000 }).withMessage('Admin notes must be less than 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { action, adminNotes } = req.body;
    
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    report.status = 'resolved';
    report.action = action;
    report.adminNotes = adminNotes || '';
    report.resolvedBy = req.user._id;
    report.resolvedAt = new Date();
    
    await report.save();
    
    // Take action based on the decision
    if (action === 'content_removed' && report.targetItem) {
      await Item.findByIdAndUpdate(report.targetItem, { status: 'Removed' });
    } else if (action === 'user_suspended' && report.targetUser) {
      await User.findByIdAndUpdate(report.targetUser, { isActive: false });
    }
    
    res.json({ message: 'Report resolved successfully' });
  } catch (error) {
    console.error('Resolve report error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/admin/categories
// @desc    Get all categories for admin
// @access  Admin
router.get('/categories', adminAuth, async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1, name: 1 });
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/admin/categories
// @desc    Create new category
// @access  Admin
router.post('/categories', adminAuth, [
  body('name').trim().notEmpty().withMessage('Category name is required'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  body('subcategories').isArray().withMessage('Subcategories must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, nameKh, description, icon, color, subcategories } = req.body;
    
    const category = new Category({
      name,
      nameKh,
      description,
      icon: icon || 'folder',
      color: color || '#6366f1',
      subcategories: subcategories || []
    });
    
    await category.save();
    
    res.status(201).json({
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    console.error('Create category error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Category name already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;