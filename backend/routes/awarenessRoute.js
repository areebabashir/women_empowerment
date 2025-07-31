import express from 'express';
import { 
  getAllAwareness, 
  getAwarenessById, 
  addAwareness, 
  updateAwareness, 
  deleteAwareness,
  toggleAwarenessStatus 
} from '../controllers/awarenessController.js';
import upload from '../helpers/multerConfig.js';

const router = express.Router();

// Get all awareness items
router.get('/getallawareness', getAllAwareness);

// Get awareness item by ID
router.get('/getawareness/:id', getAwarenessById);

// Add a new awareness item (with image upload)
router.post('/addawareness', upload.single('image'), addAwareness);

// Update an awareness item (with optional image upload)
router.put('/updateawareness/:id', upload.single('image'), updateAwareness);

// Delete an awareness item
router.delete('/deleteawareness/:id', deleteAwareness);

// Toggle awareness status
router.patch('/toggleawareness/:id', toggleAwarenessStatus);

export default router; 