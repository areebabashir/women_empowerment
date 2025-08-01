import Awareness from '../models/awarenessModel.js';

// Helper function to get random icon
const getRandomIcon = () => {
  const icons = ['Heart', 'Shield', 'Scale', 'Building', 'MapPin', 'Globe', 'Users', 'GraduationCap', 'FileText'];
  return icons[Math.floor(Math.random() * icons.length)];
};

// Helper function to get random color
const getRandomColor = () => {
  const colors = [
    'from-red-500 to-pink-600',
    'from-purple-500 to-indigo-600', 
    'from-blue-500 to-teal-600',
    'from-green-500 to-emerald-600',
    'from-orange-500 to-red-600',
    'from-indigo-500 to-purple-600',
    'from-pink-500 to-rose-600',
    'from-yellow-500 to-orange-600'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Get all awareness items
export const getAllAwareness = async (req, res) => {
  try {
    const awareness = await Awareness.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, awareness });
  } catch (error) {
    console.error('Error fetching awareness:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch awareness data' });
  }
};

// Get awareness item by ID
export const getAwarenessById = async (req, res) => {
  try {
    const { id } = req.params;
    const awareness = await Awareness.findById(id);
    
    if (!awareness) {
      return res.status(404).json({ success: false, message: 'Awareness item not found' });
    }
    
    res.status(200).json({ success: true, awareness });
  } catch (error) {
    console.error('Error fetching awareness by ID:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch awareness item' });
  }
};

// Add a new awareness item
export const addAwareness = async (req, res) => {
  try {
    const { name, description, serviceAvailable, phoneNumber, emergencyNumber, title, services, icon } = req.body;
    
    if (!name || !description || !serviceAvailable || !phoneNumber || !emergencyNumber || !icon) {
      return res.status(400).json({ success: false, message: 'Required fields are missing' });
    }
    
    // Parse services if it's a string
    let servicesArray = services;
    if (typeof services === 'string') {
      try {
        servicesArray = JSON.parse(services);
      } catch (e) {
        servicesArray = [services];
      }
    }
    
    const newAwareness = new Awareness({
      name,
      description,
      serviceAvailable,
      phoneNumber,
      emergencyNumber,
      title: title || name,
      services: servicesArray || [],
      icon: icon,
      color: getRandomColor()
    });
    
    await newAwareness.save();
    
    res.status(201).json({ success: true, awareness: newAwareness });
  } catch (error) {
    console.error('Error adding awareness:', error);
    res.status(500).json({ success: false, message: 'Failed to add awareness item' });
  }
};

// Update an awareness item
export const updateAwareness = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, serviceAvailable, phoneNumber, emergencyNumber, title, services, icon } = req.body;
    
    if (!name || !description || !serviceAvailable || !phoneNumber || !emergencyNumber || !icon) {
      return res.status(400).json({ success: false, message: 'Required fields are missing' });
    }
    
    // Parse services if it's a string
    let servicesArray = services;
    if (typeof services === 'string') {
      try {
        servicesArray = JSON.parse(services);
      } catch (e) {
        servicesArray = [services];
      }
    }
    
    const updateData = {
      name,
      description,
      serviceAvailable,
      phoneNumber,
      emergencyNumber,
      title: title || name,
      services: servicesArray || [],
      icon: icon
    };
    
    const updatedAwareness = await Awareness.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedAwareness) {
      return res.status(404).json({ success: false, message: 'Awareness item not found' });
    }
    
    res.status(200).json({ success: true, awareness: updatedAwareness });
  } catch (error) {
    console.error('Error updating awareness:', error);
    res.status(500).json({ success: false, message: 'Failed to update awareness item' });
  }
};

// Delete an awareness item
export const deleteAwareness = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAwareness = await Awareness.findByIdAndDelete(id);
    
    if (!deletedAwareness) {
      return res.status(404).json({ success: false, message: 'Awareness item not found' });
    }
    
    res.status(200).json({ success: true, message: 'Awareness item deleted successfully' });
  } catch (error) {
    console.error('Error deleting awareness:', error);
    res.status(500).json({ success: false, message: 'Failed to delete awareness item' });
  }
};

// Toggle awareness status (active/inactive)
export const toggleAwarenessStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const awareness = await Awareness.findById(id);
    
    if (!awareness) {
      return res.status(404).json({ success: false, message: 'Awareness item not found' });
    }
    
    awareness.isActive = !awareness.isActive;
    await awareness.save();
    
    res.status(200).json({ 
      success: true, 
      awareness,
      message: `Awareness item ${awareness.isActive ? 'activated' : 'deactivated'} successfully` 
    });
  } catch (error) {
    console.error('Error toggling awareness status:', error);
    res.status(500).json({ success: false, message: 'Failed to toggle awareness status' });
  }
}; 