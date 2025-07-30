import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: false
  },
  publicationDate: {
    type: Date,
    required: true
  },
  author: {
    type: String,
    required: false
  },
  isPublished: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Blog = mongoose.model("Blog", blogSchema);

export default Blog; 