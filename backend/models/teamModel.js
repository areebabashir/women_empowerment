import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  pic: { type: String, required: false },
  bio: { type: String }
}, { timestamps: true });

export default mongoose.model('Team', teamSchema); 