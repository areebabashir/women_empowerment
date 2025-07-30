import express from 'express';
import { addStory, deleteStory, getAllStories } from '../controllers/successStoryController.js';
import upload from '../helpers/multerConfig.js';

const router = express.Router();

// Add a new success story (with image upload)
router.post('/addstory', upload.single('img'), addStory);

// Delete a success story by ID
router.delete('/deletestory/:id', deleteStory);

// Get all success stories
router.get('/getallstories', getAllStories);

export default router; 