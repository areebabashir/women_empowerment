import express from 'express';
import {
  registerUser, loginUser, getProfile,
  getAllUsers, deleteUser, updateUserRole,
  getUserEvents, getUserPrograms , updateUser,
  getAllParticipationStats
} from '../controllers/userController.js';
import { protect ,addUserIdToBody} from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import upload, { uploadMultiple } from "../helpers/multerConfig.js";

const router = express.Router();

// Custom middleware to handle both single image and multiple documents
const handleRegistrationUpload = (req, res, next) => {
  // First handle the image upload
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ msg: err.message });
    }
    
    // Then handle document uploads if any
    uploadMultiple(req, res, (docErr) => {
      if (docErr) {
        return res.status(400).json({ msg: docErr.message });
      }
      next();
    });
  });
};

// Public
router.post('/register', handleRegistrationUpload, registerUser);
router.post('/login', loginUser);

router.put('/profile', upload.single('image'), addUserIdToBody, updateUser);

// New: Get all events a user has participated in
router.get('/events',protect,addUserIdToBody, getUserEvents);
// New: Get all programs a user has participated in
router.get('/programs',protect,addUserIdToBody, getUserPrograms);

// Protected
router.get('/profile', protect, addUserIdToBody , getProfile);

// Admin
router.get('/getalluser', protect, isAdmin, getAllUsers);
router.delete('/delete/:id', protect, isAdmin, deleteUser);
router.put('/update/:id/role', protect, isAdmin, updateUserRole);

// Admin: Get comprehensive participation statistics
router.get('/participation-stats', protect, isAdmin, getAllParticipationStats);

export default router;
