import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ msg: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Extracted token:', token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    const user = await User.findById(decoded.userId || decoded.id);
    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log('Token verification error:', error.message);
    return res.status(401).json({ msg: 'Invalid token' });
  }
};

export const isAdmin = (req, res, next) => {

  console.log("inside is admin")
  console.log('Headers:', req.headers);
  console.log('Authorization header:', req.headers.authorization);
  
  // Check if user exists and has admin role
  if (!req.user) {
    console.log("no user found in req.user - authentication middleware didn't run");
    return res.status(401).json({ msg: 'Authentication required' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Admin access only' });
  }
    console.log("token verified ")

  next();
};

export const isCompany = (req, res, next) => {
  // Check if user exists and has company role
  if (!req.user) {
    return res.status(401).json({ msg: 'Authentication required' });
  }
  
  if (req.user.role !== 'company') {
    return res.status(403).json({ msg: 'Company access only' });
  }
  next();
};

export const isAdminOrCompany = (req, res, next) => {
  // Check if user exists and has admin or company role
  if (!req.user) {
    return res.status(401).json({ msg: 'Authentication required' });
  }
  
  if (req.user.role !== 'admin' && req.user.role !== 'company') {
    return res.status(403).json({ msg: 'Admin or Company access only' });
  }
  
  next();
};


export const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Admin auth header:', authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ msg: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Admin token extracted:', token);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Admin decoded token:', decoded);
    
    // Find user by the ID in the token (using _id from your token structure)
    const user = await User.findById(decoded._id);
    
    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }

    req.user = user; // Set req.user for isAdmin middleware
    console.log('Admin user set in req.user:', req.user);
    next();
  } catch (error) {
    console.log('Admin token verification error:', error.message);
    return res.status(401).json({ msg: 'Invalid token' });
  }
};
