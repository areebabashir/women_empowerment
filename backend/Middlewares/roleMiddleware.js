export const isAdmin = (req, res, next) => {
  // Check if user exists and has admin role
  if (!req.user) {
    return res.status(401).json({ msg: 'Authentication required' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Admin access only' });
  }
  
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
