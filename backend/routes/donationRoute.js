import express from 'express';
import {
  createDonation,
  getAllDonations,
  getUserDonations,
  getDonationById,
  approveDonation,
} from '../controllers/donationController.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import { addUserIdToBody } from '../middlewares/authMiddleware.js'; 
import upload, { uploadReceipt } from '../helpers/multerConfig.js';

const router = express.Router();

router.post('/add',uploadReceipt, addUserIdToBody,  createDonation);

// 🔐 Admin: Get all
router.get('/all', isAdmin, getAllDonations);

// 👤 Get own donations
router.get('/user', addUserIdToBody, getUserDonations);

// 🔍 Get donation by ID
router.get('/:id', getDonationById);

// ✅ Admin approve
router.put('/:id/approve', isAdmin, approveDonation);

export default router;