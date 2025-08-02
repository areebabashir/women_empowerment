import express from 'express';
import {
  createJob,
  updateJob,
  deleteJob,
  getAllJobs,
  getJobById,
  getCompanyJobs
} from '../controllers/jobController.js';
import { protect, addUserIdToBody } from '../middlewares/authMiddleware.js';
import { isAdminOrCompany, isCompany, isAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post('/create', protect, isCompany, createJob);
router.put('/update/:id', protect, isCompany, updateJob);
router.delete('/delete/:id', protect, isAdminOrCompany, deleteJob);

router.get('/getall', getAllJobs); // public
router.get('/get/:id', getJobById); // public

router.get('/company/jobs', protect, isCompany, getCompanyJobs);

export default router;
