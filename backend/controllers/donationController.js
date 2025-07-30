import Donation from '../models/donationModel.js';
import User from '../models/userModel.js';

export const createDonation = async (req, res) => {
    console.log("req hit cd")
    try {
        const { userId } = req.body;
        console.log(userId)
        const { amount, date, method, campaign } = req.body;
        const receiptUrl = req.file?.path; // if using multer

        if (!receiptUrl) {
            return res.status(400).json({ msg: "Receipt file is required" });
        }

        const donation = await Donation.create({
            amount,
            date,
            method,
            campaign,
            receiptUrl,
            user: userId,
        });

        await User.findByIdAndUpdate(userId, {
            $push: { donations: donation._id },
        });

        res.status(201).json({ msg: 'Donation created', donation });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

export const getAllDonations = async (req, res) => {
    const donations = await Donation.find().populate('user', 'name email');
    res.json(donations);
};

export const getUserDonations = async (req, res) => {
  try {
    console.log("getUserDonations request hit");

    const { userId } = req.body;

    // Input validation
    if (!userId) {
      return res.status(400).json({ success: false, msg: "User ID is required" });
    }

    // Only fetch approved donations for the user
    const donations = await Donation.find({ user: userId, approved: true });

    if (!donations || donations.length === 0) {
      console.log("No approved donations found");
      return res.status(404).json({ success: false, msg: "No approved donations found for this user" });
    }

    console.log("Approved donations found:", donations);
    return res.status(200).json({ success: true, data: donations });

  } catch (error) {
    console.error("Error fetching user donations:", error);
    return res.status(500).json({ success: false, msg: "Internal server error" });
  }
};

export const getDonationById = async (req, res) => {
    const donation = await Donation.findById(req.params.id).populate('user', 'name');
    if (!donation) return res.status(404).json({ msg: 'Donation not found' });
    res.json(donation);
};

export const approveDonation = async (req, res) => {
    const donation = await Donation.findByIdAndUpdate(req.params.id, {
        approved: true,
    }, { new: true });

    if (!donation) return res.status(404).json({ msg: 'Donation not found' });

    res.json({ msg: 'Donation approved', donation });
};
