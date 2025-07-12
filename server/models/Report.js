const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportType: {
    type: String,
    enum: ['item', 'user', 'message'],
    required: true
  },
  targetItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  },
  targetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  targetMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  reason: {
    type: String,
    required: true,
    enum: [
      'inappropriate_content',
      'spam',
      'scam',
      'fake_item',
      'prohibited_item',
      'harassment',
      'copyright_violation',
      'other'
    ]
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  evidence: [{
    type: String, // URLs to screenshots or other evidence
  }],
  status: {
    type: String,
    enum: ['pending', 'investigating', 'resolved', 'dismissed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  adminNotes: {
    type: String,
    maxlength: 1000
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedAt: Date,
  action: {
    type: String,
    enum: ['no_action', 'warning', 'content_removed', 'user_suspended', 'user_banned'],
    default: 'no_action'
  }
}, {
  timestamps: true
});

// Indexes
reportSchema.index({ reporter: 1 });
reportSchema.index({ reportType: 1 });
reportSchema.index({ status: 1 });
reportSchema.index({ priority: 1 });
reportSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);