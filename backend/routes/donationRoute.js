import express from 'express';
import {
  createDonation,
  getAllDonations,
  getUserDonations,
  getDonationById,
  approveDonation,
  getUnapprovedDonations,
  rejectDonation
} from '../controllers/donationController.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import { addUserIdToBody } from '../middlewares/authMiddleware.js'; 
import upload, { uploadReceipt } from '../helpers/multerConfig.js';
import { authenticateAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post('/add',uploadReceipt, addUserIdToBody,  createDonation);

// 🔐 Admin: Get all
router.get('/all',authenticateAdmin, isAdmin, getAllDonations);

// 👤 Get own donations
router.get('/user', authenticateAdmin, getUserDonations);

// 🔍 Get donation by ID
router.get('/unapproved',authenticateAdmin, isAdmin, getUnapprovedDonations); // Only admin can view
router.get('/:id', getDonationById);

// ✅ Admin approve
router.put('/:id/approve',authenticateAdmin, isAdmin, approveDonation);
router.put('/reject/:id',authenticateAdmin, isAdmin, rejectDonation);



export default router;