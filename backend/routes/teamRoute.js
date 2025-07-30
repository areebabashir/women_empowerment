import express from 'express';
import { getAllTeams, getTeamById, addTeamMember, editTeam, deleteTeamById } from '../controllers/teamController.js';
import upload from '../helpers/multerConfig.js';

const router = express.Router();

// Get all team members
router.get('/getallteams', getAllTeams);

// Get a team member by ID
router.get('/getteams/:id', getTeamById);

// Add a new team member (with file upload)
router.post('/addteams', upload.single('pic'), addTeamMember);

// Edit a team member (with file upload)
router.put('/updateteams/:id', upload.single('pic'), editTeam);

// Delete a team member by ID
router.delete('/deleteteams/:id', deleteTeamById);

export default router; 