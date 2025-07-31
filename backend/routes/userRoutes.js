import express from 'express';
import {
  registerUser, loginUser, getProfile,
  getAllUsers, getAllCompanies, deleteUser, updateUserRole,
  getUserEvents, getUserPrograms, updateUser,
  getAllParticipationStats, getPendingApprovals, approveUser, rejectUser
} from '../controllers/userController.js';

import { protect, addUserIdToBody } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import upload from '../helpers/multerConfig.js';
import multer from 'multer';

const router = express.Router();

// Middleware to handle both optional image and documents in one request
const userUpload = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'documents', maxCount: 10 }
]);

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('Multer error:', err);
    return res.status(400).json({ 
      msg: 'File upload error', 
      error: err.message 
    });
  } else if (err) {
    console.error('Other error:', err);
    return res.status(500).json({ 
      msg: 'Server error', 
      error: err.message 
    });
  }
  next();
};

// Public routes - ADD MULTER MIDDLEWARE TO REGISTER ROUTE
router.post('/register', userUpload, handleMulterError, registerUser);
router.post('/login', loginUser);

// User routes
router.put('/profile', userUpload, handleMulterError, addUserIdToBody, updateUser);
router.get('/events', protect, addUserIdToBody, getUserEvents);
router.get('/programs', protect, addUserIdToBody, getUserPrograms);
router.get('/profile', protect, addUserIdToBody, getProfile);

// Admin routes
router.get('/getalluser', protect, isAdmin, getAllUsers);
router.get('/getallcompanies', protect, isAdmin, getAllCompanies);
router.delete('/delete/:id', protect, isAdmin, deleteUser);
router.put('/update/:id/role', protect, isAdmin, updateUserRole);
router.get('/participation-stats', protect, isAdmin, getAllParticipationStats);

// Approval routes
router.get('/pending-approvals', protect, isAdmin, getPendingApprovals);
router.put('/approve/:userId', protect, isAdmin, approveUser);
router.put('/reject/:userId', protect, isAdmin, rejectUser);

export default router;