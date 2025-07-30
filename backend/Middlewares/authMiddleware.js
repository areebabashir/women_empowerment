import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  console.log('Protect middleware called');
  console.log('Headers:', req.headers);
  
  const token = req.headers.authorization?.split(' ')[1];
  console.log('Extracted token:', token ? token.substring(0, 20) + '...' : 'No token');
  
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ msg: 'No token' });
  }

  try {
    // Use environment variable or fallback secret
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-for-development';
    const decoded = jwt.verify(token, jwtSecret);
    console.log('Token decoded successfully:', { id: decoded.id, role: decoded.role });
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Token verification failed:', error.message);
    res.status(401).json({ msg: 'Invalid token' });
  }
};


export const addUserIdToBody = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token provided' });

  try {
    // Use environment variable or fallback secret
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-for-development';
    const decoded = jwt.verify(token, jwtSecret);
    req.body.userId = decoded._id; // Use _id instead of id
    next();
  } catch {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

