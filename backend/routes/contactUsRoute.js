import express from 'express';
import { 
  addContactMessage, 
  getAllContactMessages, 
  getContactMessageById,
  deleteContactMessage 
} from '../controllers/contactUsController.js';

const router = express.Router();

// Add a new contact message
router.post('/addcontact', addContactMessage);

// Get all contact messages
router.get('/getallcontact', getAllContactMessages);

// Get a single contact message by ID
router.get('/getbyid/:id', getContactMessageById);

// Delete a contact message by id
router.delete('/delete/:id', deleteContactMessage);

export default router; 