// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['member','donor', 'admin', 'trainee', 'company', 'ngo'],
    default: 'member'
  },
  image: String,
  phone: { type: String, required: false },     
  address: { type: String, required: false },
  donations: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation'
  }
],

  documents: [{ type: String , required: false }], // Array of document file paths
}, { timestamps: true });

export default mongoose.model('User', userSchema);
