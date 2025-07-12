const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  nameKh: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  icon: {
    type: String,
    default: 'folder'
  },
  color: {
    type: String,
    default: '#6366f1'
  },
  subcategories: [{
    name: {
      type: String,
      required: true
    },
    nameKh: String,
    description: String,
    icon: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  itemCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for search
categorySchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Category', categorySchema);