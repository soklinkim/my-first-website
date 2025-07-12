const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversation: {
    type: String,
    required: true,
    index: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'system', 'offer'],
    default: 'text'
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  offer: {
    amount: Number,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'expired'],
      default: 'pending'
    },
    expiresAt: Date
  },
  attachments: [{
    url: String,
    type: String,
    filename: String,
    size: Number
  }],
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Indexes for performance
messageSchema.index({ conversation: 1, createdAt: -1 });
messageSchema.index({ sender: 1, receiver: 1 });
messageSchema.index({ item: 1 });
messageSchema.index({ isRead: 1 });

// Static method to create conversation ID
messageSchema.statics.createConversationId = function(userId1, userId2, itemId) {
  const users = [userId1, userId2].sort();
  return `${users[0]}_${users[1]}_${itemId}`;
};

// Static method to get conversation messages
messageSchema.statics.getConversation = function(conversationId, userId, limit = 50, page = 1) {
  const skip = (page - 1) * limit;
  
  return this.find({
    conversation: conversationId,
    deletedBy: { $ne: userId }
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .skip(skip)
  .populate('sender', 'name profileImage')
  .populate('receiver', 'name profileImage')
  .populate('item', 'title images price status');
};

// Static method to mark messages as read
messageSchema.statics.markAsRead = function(conversationId, userId) {
  return this.updateMany({
    conversation: conversationId,
    receiver: userId,
    isRead: false
  }, {
    isRead: true,
    readAt: new Date()
  });
};

// Static method to get user conversations
messageSchema.statics.getUserConversations = function(userId, limit = 20) {
  return this.aggregate([
    {
      $match: {
        $or: [{ sender: userId }, { receiver: userId }],
        deletedBy: { $ne: userId }
      }
    },
    {
      $sort: { createdAt: -1 }
    },
    {
      $group: {
        _id: '$conversation',
        lastMessage: { $first: '$$ROOT' },
        unreadCount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$receiver', userId] },
                  { $eq: ['$isRead', false] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    },
    {
      $sort: { 'lastMessage.createdAt': -1 }
    },
    {
      $limit: limit
    },
    {
      $lookup: {
        from: 'users',
        localField: 'lastMessage.sender',
        foreignField: '_id',
        as: 'sender'
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'lastMessage.receiver',
        foreignField: '_id',
        as: 'receiver'
      }
    },
    {
      $lookup: {
        from: 'items',
        localField: 'lastMessage.item',
        foreignField: '_id',
        as: 'item'
      }
    },
    {
      $unwind: '$sender'
    },
    {
      $unwind: '$receiver'
    },
    {
      $unwind: '$item'
    }
  ]);
};

module.exports = mongoose.model('Message', messageSchema);