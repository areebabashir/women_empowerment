import express from 'express';
import {
  getAllAwareness,
  getAwarenessById,
  addAwareness,
  updateAwareness,
  deleteAwareness,
  toggleAwarenessStatus
} from '../controllers/awarenessController.js';


const router = express.Router();

// Get all awareness items
router.get('/getallawareness', getAllAwareness);

// Get awareness item by ID
router.get('/getawareness/:id', getAwarenessById);

// Add a new awareness item
router.post('/addawareness', addAwareness);

// Update an awareness item
router.put('/updateawareness/:id', updateAwareness);

// Delete an awareness item
router.delete('/deleteawareness/:id', deleteAwareness);

// Toggle awareness status
router.patch('/toggleawareness/:id', toggleAwarenessStatus);

export default router; 