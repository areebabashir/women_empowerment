import express from "express";
import {
  createProgram,
  updateProgram,
  deleteProgram,
  getAllPrograms,
  getAllProgramsForAdmin,
  getProgramById,
  addParticipant,
  removeParticipant,
  getParticipants,
  getAllProgramsWithParticipants,
  getCompanyDashboardStats,
  testEndpoint
} from "../controllers/programController.js";
import upload from "../helpers/multerConfig.js";
import { addUserIdToBody, protect } from "../middlewares/authMiddleware.js";
import { isAdmin, isCompany, isAdminOrCompany } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Test endpoint for debugging
router.get("/test", testEndpoint);

// Create program with image upload (protected - requires authentication)
router.post("/create/program", protect, isAdminOrCompany, upload.single("image"), createProgram);

// Update program with image upload (protected - requires authentication)
router.put("/update/:id", protect, isAdminOrCompany, upload.single("image"), updateProgram);

// Delete program (protected - requires authentication)
router.delete("/delete/:id", protect, isAdminOrCompany, deleteProgram);

// Get company programs (protected - shows only company's own programs)
router.get("/company/programs", protect, isCompany, getAllPrograms);

// Get company dashboard stats
router.get("/company/dashboard", protect, isCompany, getCompanyDashboardStats);

// Get all programs for admin (shows all programs with company names)
router.get("/admin/getallprograms", protect, isAdmin, getAllProgramsForAdmin);

// Get all programs with participants (filtered by company if user is a company, or all programs if not authenticated)
router.get("/getallprogramwithparticipants", getAllProgramsWithParticipants);

// Get all programs (public access for website and admin panel)
router.get("/getallprogram", getAllPrograms);

// Get program by ID (public access)
router.get("/getprogram/:id", getProgramById);

// Add a participant to a program
router.post("/add/:programId/participants", addUserIdToBody, addParticipant);

// Remove a participant from a program
router.delete("/:programId/deleteparticipants", protect, isAdminOrCompany, removeParticipant);

// Get all participants for a program
router.get("/:programId/participants", protect, isAdminOrCompany, getParticipants);

export default router; 