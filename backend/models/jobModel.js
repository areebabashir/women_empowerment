import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  position: { type: String, required: true },
  jobLink: { type: String, required: true },
  description: { type: String, required: true },
  location: {type:String, required:true},
  workMode: {
    type: String,
    enum: ['Remote', 'On-site', 'Hybrid'],
    default: 'onsite'
  },
  postedAt: { type: Date, default: Date.now },

  // Reference to company
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  companyName: { type: String },
  companyEmail: { type: String }
});

export default mongoose.model('Job', jobSchema);
