const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'KHR']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subcategory: {
    type: String,
    required: true
  },
  condition: {
    type: String,
    required: true,
    enum: ['Like New', 'Good', 'Fair', 'Poor']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    province: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  specifications: {
    brand: String,
    model: String,
    year: Number,
    size: String,
    color: String,
    material: String,
    weight: String,
    dimensions: String
  },
  status: {
    type: String,
    enum: ['Active', 'Sold', 'Pending', 'Inactive', 'Removed'],
    default: 'Active'
  },
  isNegotiable: {
    type: Boolean,
    default: true
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  views: {
    type: Number,
    default: 0
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  favoriteCount: {
    type: Number,
    default: 0
  },
  inquiries: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  deliveryOptions: {
    pickup: {
      type: Boolean,
      default: true
    },
    delivery: {
      type: Boolean,
      default: false
    },
    deliveryFee: {
      type: Number,
      default: 0
    },
    deliveryRadius: {
      type: Number,
      default: 0
    }
  },
  paymentMethods: [{
    type: String,
    enum: ['Cash', 'ABA', 'Wing', 'Pi Pay', 'Bank Transfer']
  }],
  soldAt: Date,
  soldTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  soldPrice: Number,
  reportCount: {
    type: Number,
    default: 0
  },
  isReported: {
    type: Boolean,
    default: false
  },
  adminNotes: String,
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    }
  }
}, {
  timestamps: true
});

// Indexes for better search performance
itemSchema.index({ title: 'text', description: 'text', tags: 'text' });
itemSchema.index({ category: 1, subcategory: 1 });
itemSchema.index({ price: 1 });
itemSchema.index({ 'location.province': 1, 'location.city': 1 });
itemSchema.index({ seller: 1 });
itemSchema.index({ status: 1 });
itemSchema.index({ createdAt: -1 });
itemSchema.index({ views: -1 });
itemSchema.index({ favoriteCount: -1 });
itemSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for time ago
itemSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now - this.createdAt);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
});

// Instance method to increment views
itemSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Instance method to toggle favorite
itemSchema.methods.toggleFavorite = function(userId) {
  const index = this.favorites.indexOf(userId);
  if (index > -1) {
    this.favorites.splice(index, 1);
    this.favoriteCount -= 1;
  } else {
    this.favorites.push(userId);
    this.favoriteCount += 1;
  }
  return this.save();
};

// Instance method to mark as sold
itemSchema.methods.markAsSold = function(buyerId, soldPrice) {
  this.status = 'Sold';
  this.soldAt = new Date();
  this.soldTo = buyerId;
  this.soldPrice = soldPrice || this.price;
  return this.save();
};

// Static method to get trending items
itemSchema.statics.getTrending = function(limit = 10) {
  return this.find({ status: 'Active' })
    .sort({ views: -1, favoriteCount: -1, createdAt: -1 })
    .limit(limit)
    .populate('seller', 'name profileImage location rating')
    .populate('category', 'name icon');
};

// Static method to search items
itemSchema.statics.searchItems = function(query, filters = {}) {
  const searchQuery = {
    status: 'Active',
    ...filters
  };

  if (query) {
    searchQuery.$text = { $search: query };
  }

  return this.find(searchQuery)
    .sort({ score: { $meta: 'textScore' }, createdAt: -1 })
    .populate('seller', 'name profileImage location rating')
    .populate('category', 'name icon');
};

module.exports = mongoose.model('Item', itemSchema);