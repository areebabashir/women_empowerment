import express from 'express';
import {
  registerUser, loginUser, getProfile,
  getAllUsers, deleteUser, updateUserRole,
  getUserEvents, getUserPrograms, updateUser,
  getAllParticipationStats
} from '../controllers/userController.js';

import { protect, addUserIdToBody } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import upload, { uploadMultiple } from '../helpers/multerConfig.js';

const router = express.Router();

// Middleware to handle both image and documents in one request
const handleRegistrationUpload = (req, res, next) => {
  // console.log(req)

  upload.single('image')(req, res, function (err) {
    if (err) {

      console.log( err.message )
      return res.status(400).json({ msg: err.message });
    }

    // Only call uploadMultiple if documents field exists in the request
    if (req.files && req.files.documents) {
      uploadMultiple(req, res, function (docErr) {
        console.log( docErr.message )
        if (docErr) return res.status(400).json({ msg: docErr.message });
        next();
      });
    } else {
      next();
    }
  });
};



// Public routes
router.post('/register', handleRegistrationUpload, registerUser);
router.post('/login', loginUser);

// User routes
router.put('/profile', upload.single('image'), addUserIdToBody, updateUser);
router.get('/events', protect, addUserIdToBody, getUserEvents);
router.get('/programs', protect, addUserIdToBody, getUserPrograms);
router.get('/profile', protect, addUserIdToBody, getProfile);

// Admin routes
router.get('/getalluser', protect, isAdmin, getAllUsers);
router.delete('/delete/:id', protect, isAdmin, deleteUser);
router.put('/update/:id/role', protect, isAdmin, updateUserRole);
router.get('/participation-stats', protect, isAdmin, getAllParticipationStats);

export default router;
