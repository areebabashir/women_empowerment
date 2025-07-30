// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['member', 'volunteer', 'donor', 'admin', 'trainee', 'company', 'ngo'],
    default: 'member'
  },
  image: String,
  phone: { type: String, required: false },     
  address: { type: String, required: false },
  company: { type: String, required: false },
  ngo: { type: String, required: false },
  documents: [{ type: String }], // Array of document file paths
}, { timestamps: true });

export default mongoose.model('User', userSchema);
