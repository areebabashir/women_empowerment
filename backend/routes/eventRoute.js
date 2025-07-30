import express from "express";
import {
  createEvent,
  updateEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  addParticipant,
  removeParticipant,
  getParticipants,
  getAllEventsWithParticipants
} from "../controllers/eventController.js";
import upload from "../helpers/multerConfig.js";

import { addUserIdToBody, protect } from "../middlewares/authMiddleware.js";
import {isAdmin} from "../middlewares/roleMiddleware.js"
const router = express.Router();

// Create event with image upload
router.post("/create/event", upload.single("image"), createEvent);

// Update event with image upload
router.put("/update/:id", upload.single("image"), updateEvent);

// Delete event
router.delete("/delete/:id", deleteEvent);

// Get all events
router.get("/getallevent", getAllEvents);

// Get all events with participants
router.get("/getalleventwithparticipants", protect, isAdmin, getAllEventsWithParticipants);

// Get event by ID
router.get("/getevent/:id", getEventById);

// Add a participant to an event
router.post("/:eventId/participants", addUserIdToBody,addParticipant);

// Remove a participant from an event
router.delete("/:eventId/participants", protect, isAdmin, removeParticipant);

// Get all participants for an event
router.get("/:eventId/getallparticipants", protect, isAdmin, getParticipants);

export default router;
