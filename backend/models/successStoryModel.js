import mongoose from 'mongoose';

const successStorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  story: { type: String, required: true },
  img: { type: String, required: false }
}, { timestamps: true });

export default mongoose.model('SuccessStory', successStorySchema); 