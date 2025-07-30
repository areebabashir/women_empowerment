import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog
} from "../controllers/blogController.js";
import upload from "../helpers/multerConfig.js";
// import adminMiddleware from "../Middlewares/adminMiddleware.js"; // Uncomment if you have admin middleware

const router = express.Router();

// Get all blog posts
router.get("/getallblog", getAllBlogs);

// Get a single blog post
router.get("/getbyid/:id", getBlogById);

// Create a blog post (admin only)
router.post("/createblog", /*adminMiddleware,*/ upload.single("image"), createBlog);

// Update a blog post (admin only)
router.put("/update/:id", /*adminMiddleware,*/ upload.single("image"), updateBlog);

// Delete a blog post (admin only)
router.delete("/delete/:id", /*adminMiddleware,*/ deleteBlog);

export default router; 