import SuccessStory from '../models/successStoryModel.js';

// Add a new success story (with image upload)
export const addStory = async (req, res) => {
  try {
    const { name, position, story } = req.body;
    const img = req.file ? req.file.filename : null;
    if (!img) {
      return res.status(400).json({ success: false, message: 'Image is required.' });
    }
    const newStory = new SuccessStory({ name, position, story, img });
    await newStory.save();
    res.status(201).json({ success: true, story: newStory });
  } catch (error) {
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