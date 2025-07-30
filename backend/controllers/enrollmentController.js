import Enrollment from "../models/enrollmentModel.js";
import Training from "../models/trainingModel.js";

// Apply for a training (user)
export const applyForTraining = async (req, res) => {
  try {
    const { user, training } = req.body;
    // Check if training exists
    const trainingObj = await Training.findById(training);
    if (!trainingObj) {
      return res.status(404).json({ success: false, message: "Training not found" });
    }
    // Check if already enrolled
    const existing = await Enrollment.findOne({ user, training });
    if (existing) {
      return res.status(400).json({ success: false, message: "Already applied for this training" });
    }
    const enrollment = new Enrollment({
      user,
      training,
      status: "pending",
      paymentStatus: "unpaid"
    });
    await enrollment.save();
    res.status(201).json({ success: true, enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all enrollments (admin)
export const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find().populate('user').populate('training');
    res.status(200).json({ success: true, enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update enrollment status (admin)
export const updateEnrollmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }
    const enrollment = await Enrollment.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    if (!enrollment) {
      return res.status(404).json({ success: false, message: "Enrollment not found" });
    }
    res.status(200).json({ success: true, enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}; 