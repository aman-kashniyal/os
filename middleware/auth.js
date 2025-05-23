const jwt = require('jsonwebtoken');
const Staff = require('../models/Staff');

module.exports = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
    
    // Find staff member
    const staff = await Staff.findById(decoded.id).select('-password');
    if (!staff) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    // Check if staff is active
    if (!staff.isActive) {
      return res.status(401).json({ message: 'Staff account is deactivated' });
    }

    // Add staff to request object
    req.staff = staff;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}; 