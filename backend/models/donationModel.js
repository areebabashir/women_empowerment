import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  method: {
    type: String,
    required: true,
  },
  campaign: {
    type: String,
    required: true,
  },
  receiptUrl: {
    type: String,
  },
  approved:{
    type: Boolean,
    default : false,
    
  },
  rejected:{
    type:Boolean,
    default:false,
    
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
});

export default mongoose.model('Donation', donationSchema);
