const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Item = require('../models/Item');
const Category = require('../models/Category');
const Report = require('../models/Report');
const { auth, optionalAuth, verifiedUserAuth } = require('../middleware/auth');
const { uploadMultiple, getFileUrl } = require('../middleware/upload');

const router = express.Router();

// @route   GET /api/items
// @desc    Get all items with filters and pagination
// @access  Public
router.get('/', optionalAuth, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Minimum price must be non-negative'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Maximum price must be non-negative'),
  query('sort').optional().isIn(['newest', 'oldest', 'price_low', 'price_high', 'popular']).withMessage('Invalid sort option')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      page = 1,
      limit = 20,
      search,
      category,
      subcategory,
      minPrice,
      maxPrice,
      condition,
      province,
      city,
      district,
      sort = 'newest'
    } = req.query;

    // Build query
    const query = { status: 'Active' };

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    if (subcategory) {
      query.subcategory = subcategory;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (condition) {
      query.condition = condition;
    }

    if (province) {
      query['location.province'] = province;
    }

    if (city) {
      query['location.city'] = city;
    }

    if (district) {
      query['location.district'] = district;
    }

    // Build sort object
    let sortObj = {};
    switch (sort) {
      case 'newest':
        sortObj = { createdAt: -1 };
        break;
      case 'oldest':
        sortObj = { createdAt: 1 };
        break;
      case 'price_low':
        sortObj = { price: 1 };
        break;
      case 'price_high':
        sortObj = { price: -1 };
        break;
      case 'popular':
        sortObj = { views: -1, favoriteCount: -1 };
        break;
      default:
        sortObj = { createdAt: -1 };
    }

    if (search) {
      sortObj = { score: { $meta: 'textScore' }, ...sortObj };
    }

    // Execute query
    const items = await Item.find(query)
      .sort(sortObj)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('seller', 'name profileImage location rating')
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
    console.error('Get items error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/items/trending
// @desc    Get trending items
// @access  Public
router.get('/trending', optionalAuth, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const items = await Item.getTrending(parseInt(limit));
    
    res.json({ items });
  } catch (error) {
    console.error('Get trending items error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/items/:id
// @desc    Get single item by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('seller', 'name profileImage location rating totalSales joinDate')
      .populate('category', 'name icon');

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Increment views if not the seller
    if (!req.user || item.seller._id.toString() !== req.user._id.toString()) {
      await item.incrementViews();
    }

    res.json({ item });
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/items
// @desc    Create new item
// @access  Private (Verified users only)
router.post('/', verifiedUserAuth, uploadMultiple('images', 8), [
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
  body('description').trim().isLength({ min: 10, max: 2000 }).withMessage('Description must be between 10 and 2000 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').isMongoId().withMessage('Invalid category ID'),
  body('subcategory').notEmpty().withMessage('Subcategory is required'),
  body('condition').isIn(['Like New', 'Good', 'Fair', 'Poor']).withMessage('Invalid condition'),
  body('location.province').notEmpty().withMessage('Province is required'),
  body('location.city').notEmpty().withMessage('City is required'),
  body('location.district').notEmpty().withMessage('District is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'At least one image is required' });
    }

    const {
      title,
      description,
      price,
      originalPrice,
      currency,
      category,
      subcategory,
      condition,
      location,
      specifications,
      tags,
      isNegotiable,
      isUrgent,
      deliveryOptions,
      paymentMethods
    } = req.body;

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    // Process images
    const images = req.files.map((file, index) => ({
      url: getFileUrl(req, file.filename, 'items'),
      alt: `${title} - Image ${index + 1}`,
      isPrimary: index === 0
    }));

    // Create item
    const item = new Item({
      title,
      description,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      currency: currency || 'USD',
      category,
      subcategory,
      condition,
      images,
      seller: req.user._id,
      location: JSON.parse(location),
      specifications: specifications ? JSON.parse(specifications) : {},
      tags: tags ? JSON.parse(tags) : [],
      isNegotiable: isNegotiable === 'true',
      isUrgent: isUrgent === 'true',
      deliveryOptions: deliveryOptions ? JSON.parse(deliveryOptions) : { pickup: true },
      paymentMethods: paymentMethods ? JSON.parse(paymentMethods) : ['Cash']
    });

    await item.save();

    // Update category item count
    await Category.findByIdAndUpdate(category, { $inc: { itemCount: 1 } });

    // Populate and return
    const populatedItem = await Item.findById(item._id)
      .populate('seller', 'name profileImage location rating')
      .populate('category', 'name icon');

    res.status(201).json({
      message: 'Item created successfully',
      item: populatedItem
    });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/items/:id
// @desc    Update item
// @access  Private (Owner only)
router.put('/:id', auth, uploadMultiple('images', 8), [
  body('title').optional().trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
  body('description').optional().trim().isLength({ min: 10, max: 2000 }).withMessage('Description must be between 10 and 2000 characters'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('condition').optional().isIn(['Like New', 'Good', 'Fair', 'Poor']).withMessage('Invalid condition')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Check ownership
    if (item.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this item' });
    }

    // Check if item can be updated
    if (item.status === 'Sold') {
      return res.status(400).json({ error: 'Cannot update sold item' });
    }

    // Update fields
    const updateFields = {};
    const allowedFields = [
      'title', 'description', 'price', 'originalPrice', 'condition',
      'specifications', 'tags', 'isNegotiable', 'isUrgent',
      'deliveryOptions', 'paymentMethods'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (['specifications', 'tags', 'deliveryOptions', 'paymentMethods'].includes(field)) {
          updateFields[field] = JSON.parse(req.body[field]);
        } else {
          updateFields[field] = req.body[field];
        }
      }
    });

    // Handle new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file, index) => ({
        url: getFileUrl(req, file.filename, 'items'),
        alt: `${item.title} - Image ${index + 1}`,
        isPrimary: index === 0 && item.images.length === 0
      }));
      updateFields.images = [...item.images, ...newImages];
    }

    Object.assign(item, updateFields);
    await item.save();

    const populatedItem = await Item.findById(item._id)
      .populate('seller', 'name profileImage location rating')
      .populate('category', 'name icon');

    res.json({
      message: 'Item updated successfully',
      item: populatedItem
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/items/:id
// @desc    Delete item
// @access  Private (Owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Check ownership
    if (item.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this item' });
    }

    // Check if item can be deleted
    if (item.status === 'Sold') {
      return res.status(400).json({ error: 'Cannot delete sold item' });
    }

    await Item.findByIdAndDelete(req.params.id);

    // Update category item count
    await Category.findByIdAndUpdate(item.category, { $inc: { itemCount: -1 } });

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/items/:id/favorite
// @desc    Toggle item favorite
// @access  Private
router.post('/:id/favorite', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    await item.toggleFavorite(req.user._id);

    res.json({
      message: 'Favorite toggled successfully',
      isFavorited: item.favorites.includes(req.user._id),
      favoriteCount: item.favoriteCount
    });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/items/:id/mark-sold
// @desc    Mark item as sold
// @access  Private (Owner only)
router.post('/:id/mark-sold', auth, [
  body('soldPrice').optional().isFloat({ min: 0 }).withMessage('Sold price must be a positive number'),
  body('buyerId').optional().isMongoId().withMessage('Invalid buyer ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Check ownership
    if (item.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to mark this item as sold' });
    }

    if (item.status === 'Sold') {
      return res.status(400).json({ error: 'Item is already marked as sold' });
    }

    const { soldPrice, buyerId } = req.body;
    await item.markAsSold(buyerId, soldPrice);

    // Update seller's total sales
    await User.findByIdAndUpdate(req.user._id, { $inc: { totalSales: 1 } });

    res.json({
      message: 'Item marked as sold successfully',
      item
    });
  } catch (error) {
    console.error('Mark sold error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/items/:id/report
// @desc    Report item
// @access  Private
router.post('/:id/report', auth, [
  body('reason').isIn([
    'inappropriate_content', 'spam', 'scam', 'fake_item', 
    'prohibited_item', 'copyright_violation', 'other'
  ]).withMessage('Invalid report reason'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Check if user already reported this item
    const existingReport = await Report.findOne({
      reporter: req.user._id,
      reportType: 'item',
      targetItem: item._id
    });

    if (existingReport) {
      return res.status(400).json({ error: 'You have already reported this item' });
    }

    const { reason, description, evidence } = req.body;

    const report = new Report({
      reporter: req.user._id,
      reportType: 'item',
      targetItem: item._id,
      reason,
      description,
      evidence: evidence || []
    });

    await report.save();

    // Update item report count
    await Item.findByIdAndUpdate(item._id, { 
      $inc: { reportCount: 1 },
      $set: { isReported: true }
    });

    res.json({ message: 'Report submitted successfully' });
  } catch (error) {
    console.error('Report item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;