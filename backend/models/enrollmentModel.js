import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  training: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Training",
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  paymentStatus: {
    type: String,
    enum: ["unpaid", "paid"],
    default: "unpaid"
  },
  paymentIntentId: {
    type: String
  }
}, { timestamps: true });

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

export default Enrollment; 