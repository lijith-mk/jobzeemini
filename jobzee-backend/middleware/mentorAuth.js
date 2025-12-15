const jwt = require('jsonwebtoken');
const Mentor = require('../models/Mentor');

const mentorAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_jwt_secret_key');
    
    // Check if user is a mentor
    if (decoded.role !== 'mentor') {
      return res.status(403).json({ message: 'Access denied. Mentor access required.' });
    }
    
    // Check if mentor still exists and is approved
    const mentor = await Mentor.findById(decoded.id);
    if (!mentor) {
      return res.status(401).json({ message: 'Mentor not found' });
    }
    
    if (mentor.status !== 'approved') {
      return res.status(403).json({ message: 'Your account is not approved yet' });
    }
    
    req.mentor = mentor;
    next();
  } catch (error) {
    console.error('Mentor authentication error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = mentorAuth;