import express from "express";
import {
  createProgram,
  updateProgram,
  deleteProgram,
  getAllPrograms,
  getProgramById,
  addParticipant,
  removeParticipant,
  getParticipants,
  getAllProgramsWithParticipants
} from "../controllers/programController.js";
import upload from "../helpers/multerConfig.js";
import { addUserIdToBody, protect } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";



const router = express.Router();

// Create program with image upload
router.post("/create/program", upload.single("image"), createProgram);

// Update program with image upload
router.put("/update/:id", upload.single("image"), updateProgram);

// Delete program
router.delete("/delete/:id", deleteProgram);

// Get all programs
router.get("/getallprogram", getAllPrograms);

// Get all programs with participants
router.get("/getallprogramwithparticipants", protect, isAdmin, getAllProgramsWithParticipants);

// Get program by ID
router.get("/getprogram/:id", getProgramById);

// Add a participant to a program
router.post("/add/:programId/participants",addUserIdToBody ,addParticipant);

// Remove a participant from a program
router.delete("/:programId/deleteparticipants", protect, isAdmin, removeParticipant);

// Get all participants for a program
router.get("/:programId/participants", protect, isAdmin, getParticipants);

export default router; 