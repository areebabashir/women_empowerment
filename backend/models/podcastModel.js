import mongoose from "mongoose";

const podcastSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  episodeNumber: {
    type: Number,
    required: true,
    unique: true
  },
  video: {
    type: String,
    required: true
  },
  guest: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: String,
    required: false,
    trim: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Podcast = mongoose.model("Podcast", podcastSchema);

export default Podcast; 