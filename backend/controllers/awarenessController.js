import Awareness from '../models/awarenessModel.js';

// Get all awareness items
export const getAllAwareness = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    let query = { isActive: true };
    
    // Add search functionality
    if (search) {
      query.$text = { $search: search };
    }
    
    const awareness = await Awareness.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Awareness.countDocuments(query);
    
    res.status(200).json({
      success: true,
      awareness,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get awareness error:', error);
    res.status(500).json({ success: false, message: error.message });
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
    console.error('Get awareness by ID error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a new awareness item
export const addAwareness = async (req, res) => {
  try {
    console.log('Add awareness request received:', {
      body: req.body,
      file: req.file
    });
    
    const { name, description, serviceAvailable, phoneNumber, emergencyNumber } = req.body;
    
    // Validate required fields
    if (!name || !description || !serviceAvailable || !phoneNumber || !emergencyNumber) {
      return res.status(400).json({ 
        success: false, 
        message: "Name, description, service available, phone number, and emergency number are required" 
      });
    }
    
    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "Image is required" 
      });
    }
    
    // Save the full path to the image
    const image = `uploads/images/${req.file.filename}`;
    
    const newAwareness = new Awareness({
      name,
      description,
      image,
      serviceAvailable,
      phoneNumber,
      emergencyNumber
    });
    
    await newAwareness.save();
    
    console.log('Awareness created successfully:', newAwareness);
    res.status(201).json({ success: true, awareness: newAwareness });
  } catch (error) {
    console.error('Add awareness error:', error);
    
    // Handle specific validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false, 
        message: "Validation error", 
        errors: validationErrors 
      });
    }
    
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update an awareness item
export const updateAwareness = async (req, res) => {
  try {
    console.log('Update awareness request received:', {
      id: req.params.id,
      body: req.body,
      file: req.file
    });
    
    const { id } = req.params;
    const { name, description, serviceAvailable, phoneNumber, emergencyNumber } = req.body;
    
    // Validate required fields
    if (!name || !description || !serviceAvailable || !phoneNumber || !emergencyNumber) {
      return res.status(400).json({ 
        success: false, 
        message: "Name, description, service available, phone number, and emergency number are required" 
      });
    }
    
    // Prepare update data
    const updateData = {
      name,
      description,
      serviceAvailable,
      phoneNumber,
      emergencyNumber
    };
    
    // Only update image if a new file is uploaded
    if (req.file) {
      updateData.image = `uploads/images/${req.file.filename}`;
      console.log('New image uploaded:', updateData.image);
    }
    
    console.log('Updating awareness with data:', updateData);
    
    const updatedAwareness = await Awareness.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedAwareness) {
      return res.status(404).json({ success: false, message: 'Awareness item not found' });
    }
    
    console.log('Awareness updated successfully:', updatedAwareness);
    res.status(200).json({ success: true, awareness: updatedAwareness });
  } catch (error) {
    console.error('Update awareness error:', error);
    
    // Handle specific validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false, 
        message: "Validation error", 
        errors: validationErrors 
      });
    }
    
    // Handle MongoDB errors
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid awareness ID format" 
      });
    }
    
    res.status(500).json({ success: false, message: error.message });
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
    console.error('Delete awareness error:', error);
    res.status(500).json({ success: false, message: error.message });
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
      message: `Awareness ${awareness.isActive ? 'activated' : 'deactivated'} successfully`,
      awareness 
    });
  } catch (error) {
    console.error('Toggle awareness status error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}; 