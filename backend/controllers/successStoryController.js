import SuccessStory from '../models/successStoryModel.js';

// Add a new success story (with image upload)
export const addStory = async (req, res) => {
  try {
    const { name, position, story } = req.body;
    
    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image is required.' });
    }
    
    // Save the full path to the image
    const img = `uploads/images/${req.file.filename}`;
    
    const newStory = new SuccessStory({ name, position, story, img });
    await newStory.save();
    
    res.status(201).json({ success: true, story: newStory });
  } catch (error) {
    console.error('Add story error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single success story by ID
export const getStoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const story = await SuccessStory.findById(id);
    
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found.' });
    }
    
    res.status(200).json({ success: true, story });
  } catch (error) {
    console.error('Get story error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a success story by ID
export const deleteStory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SuccessStory.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Story not found.' });
    }
    res.status(200).json({ success: true, message: 'Story deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all success stories
export const getAllStories = async (req, res) => {
  try {
    const stories = await SuccessStory.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, stories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}; 