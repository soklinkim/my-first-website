const express = require('express');
const { body, validationResult } = require('express-validator');
const Message = require('../models/Message');
const Item = require('../models/Item');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/messages/conversations
// @desc    Get user's conversations
// @access  Private
router.get('/conversations', auth, async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    const conversations = await Message.getUserConversations(req.user._id, parseInt(limit));
    
    res.json({ conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/messages/conversation/:conversationId
// @desc    Get messages in a conversation
// @access  Private
router.get('/conversation/:conversationId', auth, async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    
    const messages = await Message.getConversation(
      req.params.conversationId,
      req.user._id,
      parseInt(limit),
      parseInt(page)
    );
    
    // Mark messages as read
    await Message.markAsRead(req.params.conversationId, req.user._id);
    
    res.json({ messages });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/messages
// @desc    Send a message
// @access  Private
router.post('/', auth, [
  body('receiverId').isMongoId().withMessage('Invalid receiver ID'),
  body('itemId').isMongoId().withMessage('Invalid item ID'),
  body('content').trim().isLength({ min: 1, max: 1000 }).withMessage('Message must be between 1 and 1000 characters'),
  body('messageType').optional().isIn(['text', 'image', 'offer']).withMessage('Invalid message type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { receiverId, itemId, content, messageType = 'text', offer } = req.body;

    // Check if item exists
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Create conversation ID
    const conversationId = Message.createConversationId(req.user._id, receiverId, itemId);

    // Create message
    const message = new Message({
      conversation: conversationId,
      sender: req.user._id,
      receiver: receiverId,
      item: itemId,
      messageType,
      content,
      offer: offer || undefined
    });

    await message.save();

    // Populate and return
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name profileImage')
      .populate('receiver', 'name profileImage')
      .populate('item', 'title images price status');

    res.status(201).json({
      message: 'Message sent successfully',
      data: populatedMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/messages/:id/read
// @desc    Mark message as read
// @access  Private
router.put('/:id/read', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Check if user is the receiver
    if (message.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (!message.isRead) {
      message.isRead = true;
      message.readAt = new Date();
      await message.save();
    }

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/messages/:id
// @desc    Delete message
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Check if user is sender or receiver
    if (message.sender.toString() !== req.user._id.toString() && 
        message.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Add user to deletedBy array
    if (!message.deletedBy.includes(req.user._id)) {
      message.deletedBy.push(req.user._id);
      await message.save();
    }

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;