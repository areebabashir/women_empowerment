import Training from "../models/trainingModel.js";

// Create a new training program
export const createTraining = async (req, res) => {
  try {
    const { title, description, date, price, isActive } = req.body;
    let image = req.body.image;
    if (req.file) {
      image = req.file.filename;
    }
    const training = new Training({
      title,
      description,
      date,
      image,
      price,
      isActive: isActive !== undefined ? isActive : true
    });
    await training.save();
    res.status(201).json({ success: true, training });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all training programs
export const getAllTrainings = async (req, res) => {
  try {
    const trainings = await Training.find().sort({ date: -1 });
    res.status(200).json({ success: true, trainings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a specific training by ID
export const getTrainingById = async (req, res) => {
  try {
    const { id } = req.params;
    const training = await Training.findById(id);
    if (!training) {
      return res.status(404).json({ success: false, message: "Training not found" });
    }
    res.status(200).json({ success: true, training });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}; 