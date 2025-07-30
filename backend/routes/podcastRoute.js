import express from "express";
import {
  createPodcast,
  getAllPodcasts,
  getPodcastById,
  getPodcastByEpisode,
  updatePodcast,
  deletePodcast,
  togglePodcastPublish
} from "../controllers/podcastController.js";
import upload from "../helpers/multerConfig.js";
// import adminMiddleware from "../Middlewares/adminMiddleware.js"; // Uncomment if you have admin middleware

const router = express.Router();

// Get all podcast episodes
router.get("/getallpodcasts", getAllPodcasts);

// Get a single podcast episode by ID
router.get("/getbyid/:id", getPodcastById);

// Get podcast by episode number
router.get("/episode/:episodeNumber", getPodcastByEpisode);

// Create a podcast episode (admin only)
router.post("/createpodcast", /*adminMiddleware,*/ upload.single("video"), createPodcast);

// Update a podcast episode (admin only)
router.put("/update/:id", /*adminMiddleware,*/ upload.single("video"), updatePodcast);

// Delete a podcast episode (admin only)
router.delete("/delete/:id", /*adminMiddleware,*/ deletePodcast);

// Toggle publish/unpublish podcast (admin only)
router.patch("/toggle-publish/:id", /*adminMiddleware,*/ togglePodcastPublish);

export default router; 