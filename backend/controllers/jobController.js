import Job from '../models/jobModel.js';
import User from '../models/userModel.js';

export const createJob = async (req, res) => {
  try {
    const { position, jobLink, description, workMode } = req.body;
    const companyId = req.user._id;

    const company = await User.findById(companyId);
    if (!company || company.role !== 'company') {
      return res.status(403).json({ msg: 'Only company accounts can post jobs' });
    }

    const job = await Job.create({
      position,
      jobLink,
      description,
      workMode,
      company: company._id,
      companyName: company.name,
      companyEmail: company.email
    });

    res.status(201).json({ msg: 'Job posted successfully', job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Only allow updating these fields
    const allowedFields = ['position', 'jobLink', 'description', 'workMode'];
    const filteredUpdates = {};
    allowedFields.forEach(field => {
      if (updates[field]) filteredUpdates[field] = updates[field];
    });

    const job = await Job.findByIdAndUpdate(id, filteredUpdates, { new: true });
    if (!job) return res.status(404).json({ msg: 'Job not found' });

    res.status(200).json({ msg: 'Job updated', job });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Job.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ msg: 'Job not found' });

    res.status(200).json({ msg: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ postedAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ msg: 'Job not found' });

    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

export const getCompanyJobs = async (req, res) => {
  try {
    const userId =  req.user._id;
    const jobs = await Job.find({ company: userId }).sort({ postedAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
