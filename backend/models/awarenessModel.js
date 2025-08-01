import mongoose from 'mongoose';

const awarenessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },

  serviceAvailable: {
    type: String,
    required: [true, 'Service available is required'],
    trim: true,
    maxlength: [200, 'Service available cannot exceed 200 characters']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    maxlength: [20, 'Phone number cannot exceed 20 characters']
  },
  emergencyNumber: {
    type: String,
    trim: true,
    maxlength: [20, 'Emergency number cannot exceed 20 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Legal awareness specific fields
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  services: [{
    type: String,
    trim: true
  }],
  icon: {
    type: String,
    required: [true, 'Icon is required'],
    enum: [
      'Heart', 'Shield', 'Scale', 'Building', 'MapPin',
      'Globe', 'Users', 'GraduationCap', 'FileText'
    ]
  },
  color: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Add text index for search functionality
awarenessSchema.index({
  name: 'text',
  description: 'text',
  serviceAvailable: 'text',
  title: 'text'
});

const Awareness = mongoose.model('Awareness', awarenessSchema);

export default Awareness; 