import express from "express";
import {
  createGallery,
  getAllGallery,
  getGalleryById,
  updateGallery,
  deleteGallery,
  getGalleryByCategory,
  getGalleryCategories
} from "../controllers/galleryController.js";
import upload from "../helpers/multerConfig.js";
// import adminMiddleware from "../Middlewares/adminMiddleware.js"; // Uncomment if you have admin middleware

const router = express.Router();

// Get all gallery items
router.get("/getallgallery", getAllGallery);

// Get gallery items by category
router.get("/category/:category", getGalleryByCategory);

// Get all categories
router.get("/categories", getGalleryCategories);

// Get a single gallery item
router.get("/getbyid/:id", getGalleryById);

// Create a gallery item (admin only)
router.post("/creategallery", /*adminMiddleware,*/ upload.array("images", 10), createGallery);

// Update a gallery item (admin only)
router.put("/update/:id", /*adminMiddleware,*/ upload.array("images", 10), updateGallery);

// Delete a gallery item (admin only)
router.delete("/delete/:id", /*adminMiddleware,*/ deleteGallery);

export default router; 