const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ error: 'Token is not valid' });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is suspended' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(401).json({ error: 'Token is not valid' });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (!req.user.isAdmin) {
        return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
      }
      next();
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.id).select('-password');
    
    if (user && user.isActive) {
      req.user = user;
    } else {
      req.user = null;
    }
    
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

const verifiedUserAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (!req.user.idCard.verified) {
        return res.status(403).json({ error: 'ID verification required to perform this action' });
      }
      next();
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { auth, adminAuth, optionalAuth, verifiedUserAuth };