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
  
  // Approval fields for company and NGO
  isApproved: {
    type: Boolean,
    default: function() {
      // Default to true for all roles except company and ngo
      return this.role !== 'company' && this.role !== 'ngo';
    }
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: function() {
      // Default to pending for company and ngo, approved for others
      return (this.role === 'company' || this.role === 'ngo') ? 'pending' : 'approved';
    }
  },
  approvalDate: {
    type: Date,
    default: null
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  rejectionReason: {
    type: String,
    default: null
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
