import Gallery from "../models/galleryModel.js";

// Create a new gallery item
export const createGallery = async (req, res) => {
  try {
    console.log('Create gallery request received:', {
      body: req.body,
      files: req.files
    });
    
    const { title, category, date, description, tags } = req.body;
    
    // Validate required fields
    if (!title || !category || !date || !description) {
      return res.status(400).json({ 
        success: false, 
        message: "Title, category, date, and description are required" 
      });
    }
    
    // Handle multiple images
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.filename);
    }
    
    // Ensure we have at least one image
    if (images.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "At least one image is required" 
      });
    }
    
    const galleryData = {
      title,
      category,
      date,
      description,
      images
    };
    
    // Handle tags
    if (tags) {
      galleryData.tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }
    
    const gallery = new Gallery(galleryData);
    await gallery.save();
    
    console.log('Gallery created successfully:', gallery);
    res.status(201).json({ success: true, gallery });
  } catch (error) {
    console.error('Gallery creation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all gallery items
export const getAllGallery = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    
    let query = { isActive: true };
    if (category) {
      query.category = category;
    }
    
    const galleries = await Gallery.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Gallery.countDocuments(query);
    
    res.status(200).json({ 
      success: true, 
      galleries,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single gallery item by ID
export const getGalleryById = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findById(id);
    if (!gallery) {
      return res.status(404).json({ success: false, message: "Gallery item not found" });
    }
    res.status(200).json({ success: true, gallery });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a gallery item by ID
export const updateGallery = async (req, res) => {
  try {
    
    const { id } = req.params;
    const { 
      title, 
      category, 
      date, 
      description, 
      tags,
      existingImages,
      imagesToDelete,
      totalImages,
      originalImageCount
    } = req.body;
    
    // Validate required fields
    if (!title || !category || !date || !description) {
      return res.status(400).json({ 
        success: false, 
        message: "Title, category, date, and description are required" 
      });
    }
    
    // Prepare update data
    const updateData = {
      title,
      category,
      date,
      description
    };
    
    // Handle tags
    if (tags) {
      updateData.tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }
    
    // Handle images - complex logic for existing, new, and deleted images
    let finalImages = [];
    
    // Parse existing images (images to keep)
    if (existingImages) {
      const existingImagesArray = Array.isArray(existingImages) ? existingImages : [existingImages];
      finalImages = existingImagesArray.map(img => {
        // Extract filename from full URL if needed
        if (img.includes('/uploads/')) {
          return img.split('/uploads/')[1];
        }
        return img;
      });
    }
    
    // Add new uploaded images
    if (req.files && req.files.length > 0) {
      const newImageFilenames = req.files.map(file => file.filename);
      finalImages = [...finalImages, ...newImageFilenames];
    }
    
    // Parse images to delete (if provided as JSON string)
    let imagesToDeleteArray = [];
    if (imagesToDelete) {
      try {
        imagesToDeleteArray = JSON.parse(imagesToDelete);
      } catch (e) {
        imagesToDeleteArray = [imagesToDelete];
      }
    }
    
    // Remove deleted images from final images array
    if (imagesToDeleteArray.length > 0) {
      const deletedFilenames = imagesToDeleteArray.map(img => {
        if (img.includes('/uploads/')) {
          return img.split('/uploads/')[1];
        }
        return img;
      });
      finalImages = finalImages.filter(img => !deletedFilenames.includes(img));
    }
    
    // Ensure we have at least one image
    if (finalImages.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "At least one image is required" 
      });
    }
    
    updateData.images = finalImages;
    

    
    // First, check if the gallery exists
    const existingGallery = await Gallery.findById(id);
    if (!existingGallery) {
      return res.status(404).json({ success: false, message: "Gallery item not found" });
    }
    
    // Now try to update
    const gallery = await Gallery.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, gallery });
  } catch (error) {
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
        message: "Invalid gallery ID format" 
      });
    }
    
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a gallery item by ID
export const deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findByIdAndDelete(id);
    if (!gallery) {
      return res.status(404).json({ success: false, message: "Gallery item not found" });
    }
    res.status(200).json({ success: true, message: "Gallery item deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get gallery items by category
export const getGalleryByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const galleries = await Gallery.find({ 
      category, 
      isActive: true 
    })
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Gallery.countDocuments({ category, isActive: true });
    
    res.status(200).json({ 
      success: true, 
      galleries,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all categories
export const getGalleryCategories = async (req, res) => {
  try {
    const categories = await Gallery.distinct("category", { isActive: true });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}; 