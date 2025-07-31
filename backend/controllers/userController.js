import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Event from '../models/eventModel.js';
import Program from '../models/programModel.js';
import mongoose from 'mongoose';

// Register
export const registerUser = async (req, res) => {
  try {
    console.log('=== Registration Request Debug ===');
    console.log('req.body:', req.body);
    console.log('req.files:', req.files);
    console.log('req.file:', req.file);
    
    const { name, email, password, role, phone, address } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Name, email, and password are required' });
    }
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User Already exists' });
    }

    // Validate NGO documents requirement
    if (role === 'ngo') {
      if (!req.files || !req.files['documents'] || req.files['documents'].length === 0) {
        return res.status(400).json({ msg: 'Documents are required for NGO registration' });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Prepare user data
    const userData = {
      name,
      email,
      password: hashedPassword,
      role: role || 'member',
      phone: phone || '',
      address: address || '',
    };

    console.log('User data before files:', userData);

    // Add image path if file was uploaded
    if (req.files && req.files['image'] && req.files['image'][0]) {
      userData.image = `uploads/images/${req.files['image'][0].filename}`;
      console.log('Image added:', userData.image);
    }

    // Add documents if files were uploaded (for NGO role)
    if (req.files && req.files['documents'] && req.files['documents'].length > 0) {
      userData.documents = req.files['documents'].map(file => `uploads/documents/${file.filename}`);
      console.log('Documents added:', userData.documents);
      
      // If user is NGO, copy documents to company_ngo folder
      if (role === 'ngo') {
        try {
          const copyPromises = req.files['documents'].map(file => 
            copyToCompanyFolder(file.path, file.filename)
          );
          await Promise.all(copyPromises);
        } catch (copyError) {
          console.error('Error copying files to company_ngo folder:', copyError);
          // Don't fail registration if copy fails, just log the error
        }
      }
    }

    console.log('Final user data:', userData);

    // Create user
    user = await User.create(userData);

    res.status(201).json({ 
      success: true,
      msg: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
        documents: user.documents
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false,
      msg: 'Server error', 
      error: error.message 
    });
  }
};
import { copyToCompanyFolder } from '../helpers/multerConfig.js';
import path from 'path';

export const updateUser = async (req, res) => {
  try {
    const {userId} = req.body;
    const { name, address, phone, role } = req.body;
    console.log(req.body)

    // Get current user to check role
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Prepare update data
    const updatedData = {};

    if (name) updatedData.name = name;
    if (address) updatedData.address = address;
    if (phone) updatedData.phone = phone;
    if (role) updatedData.role = role;
    
    // If image is uploaded
    if (req.files && req.files['image'] && req.files['image'][0]) {
      const imageFile = req.files['image'][0];
      updatedData.image = `uploads/images/${imageFile.filename}`;
      
      // If user is a company or NGO, also copy to company_ngo folder
      if (currentUser.role === 'company' || currentUser.role === 'ngo' || 
          (role && (role === 'company' || role === 'ngo'))) {
        try {
          const sourceImagePath = path.join('uploads/images', imageFile.filename);
          await copyToCompanyFolder(sourceImagePath, imageFile.filename);
          console.log(`Image copied to company_ngo folder for ${currentUser.role || role} user`);
        } catch (copyError) {
          console.error('Failed to copy image to company_ngo folder:', copyError);
          // Continue execution even if copy fails
        }
      }
    }

    // If documents are uploaded (for NGO users)
    if (req.files && req.files['documents'] && req.files['documents'].length > 0) {
      updatedData.documents = req.files['documents'].map(file => `uploads/documents/${file.filename}`);
    }

    // Update user in database
    const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.status(200).json({
      msg: 'User updated successfully',
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        image: user.image,
        documents: user.documents,
        createdAt : user.createdAt
      }
    });

  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Login
export const loginUser = async (req, res) => {
  console.log("req hit")
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    console.log(email)
    if (!user){
      return res.status(400).json({ msg: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check approval status for companies and NGOs
    if ((user.role === 'company' || user.role === 'ngo') && !user.isApproved) {
      if (user.approvalStatus === 'pending') {
        return res.status(403).json({ 
          msg: 'Your account is pending approval. Please wait for admin approval.',
          approvalStatus: 'pending'
        });
      } else if (user.approvalStatus === 'rejected') {
        return res.status(403).json({ 
          msg: `Your account has been rejected. Reason: ${user.rejectionReason || 'No reason provided'}`,
          approvalStatus: 'rejected',
          rejectionReason: user.rejectionReason
        });
      }
    }

    // Use environment variable or fallback secret
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-for-development';
    const token = jwt.sign({ _id: user._id, role: user.role }, jwtSecret, { expiresIn: '1d' });
    res.json({ 
      msg: 'Login successful', 
      token, 
      role: user.role,
      isApproved: user.isApproved,
      approvalStatus: user.approvalStatus
    });
  } catch {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get profile
export const getProfile = async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId).select('-password');
  if (!user) {
    return res.status(404).json({ msg: 'User not found' });
  }
  res.json(user);
};

// Admin: Get all users
export const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    let query = {};
    
    // If role filter is provided, filter by role
    if (role) {
      query.role = role;
    }
    
    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all companies for admin dashboard
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await User.find({ role: 'company' }).select('-password');
    
    // Get program count for each company
    const companiesWithStats = await Promise.all(
      companies.map(async (company) => {
        const programCount = await Program.countDocuments({ companyId: company._id });
        const participantCount = await Program.aggregate([
          { $match: { companyId: company._id } },
          { $unwind: '$participants' },
          { $group: { _id: null, count: { $sum: 1 } } }
        ]);
        
        return {
          ...company.toObject(),
          programCount,
          participantCount: participantCount.length > 0 ? participantCount[0].count : 0
        };
      })
    );
    
    res.status(200).json({
      success: true,
      companies: companiesWithStats,
      totalCompanies: companiesWithStats.length
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};

// Admin: Delete user
export const deleteUser = async (req, res) => {
  const UserId = req.params.id
  await User.findByIdAndDelete(UserId);
  await Event.updateMany(
  { participants: UserId },
  { $pull: { participants: UserId } }
  );
  await Program.updateMany(
    { participants: UserId },
    { $pull: { participants: UserId } }
  );
  res.json({ msg: 'User deleted' });
};

// Admin: Update role
export const updateUserRole = async (req, res) => {
  const { role } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ msg: 'User not found' });

  user.role = role;
  await user.save();
  res.json({ msg: 'User role updated' });
};

// Get all events a user has participated in

export const getUserEvents = async (req, res) => {
  try {
    const {userId} = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: 'Invalid user ID' });
    }

    const events = await Event.find({ participants: userId })

    res.json(events);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};


// Get all programs a user has participated in

export const getUserPrograms = async (req, res) => {
  try {
    const {userId} = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: 'Invalid user ID' });
    }

    const programs = await Program.find({ participants: userId });

    res.json(programs);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get comprehensive participation statistics (Admin only)
export const getAllParticipationStats = async (req, res) => {
  try {
    // Get all events with participants
    const events = await Event.find().populate('participants', 'name email phone role');
    
    // Get all programs with participants
    const programs = await Program.find().populate('participants', 'name email phone role');
    
    // Calculate statistics
    const totalEvents = events.length;
    const totalPrograms = programs.length;
    const totalParticipantsInEvents = events.reduce((sum, event) => sum + event.participants.length, 0);
    const totalParticipantsInPrograms = programs.reduce((sum, program) => sum + program.participants.length, 0);
    
    // Get unique participants across all events and programs
    const allEventParticipants = events.flatMap(event => event.participants.map(p => p._id.toString()));
    const allProgramParticipants = programs.flatMap(program => program.participants.map(p => p._id.toString()));
    const uniqueParticipants = new Set([...allEventParticipants, ...allProgramParticipants]);
    
    // Get top participating users
    const participantCounts = {};
    [...allEventParticipants, ...allProgramParticipants].forEach(participantId => {
      participantCounts[participantId] = (participantCounts[participantId] || 0) + 1;
    });
    
    const topParticipants = Object.entries(participantCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([userId, count]) => ({ userId, participationCount: count }));
    
    res.status(200).json({
      success: true,
      statistics: {
        totalEvents,
        totalPrograms,
        totalParticipantsInEvents,
        totalParticipantsInPrograms,
        totalUniqueParticipants: uniqueParticipants.size,
        averageParticipantsPerEvent: totalEvents > 0 ? (totalParticipantsInEvents / totalEvents).toFixed(2) : 0,
        averageParticipantsPerProgram: totalPrograms > 0 ? (totalParticipantsInPrograms / totalPrograms).toFixed(2) : 0
      },
      events: events.map(event => ({
        _id: event._id,
        title: event.title,
        participants: event.participants,
        totalParticipants: event.participants.length
      })),
      programs: programs.map(program => ({
        _id: program._id,
        title: program.title,
        participants: program.participants,
        totalParticipants: program.participants.length
      })),
      topParticipants
    });
  } catch (error) {
    console.error('Participation stats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get pending approvals (companies and NGOs)
export const getPendingApprovals = async (req, res) => {
  try {
    const pendingUsers = await User.find({
      role: { $in: ['company', 'ngo'] },
      approvalStatus: 'pending'
    }).select('-password');

    res.json({
      success: true,
      data: pendingUsers
    });
  } catch (error) {
    console.error('Error fetching pending approvals:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Approve user (company or NGO)
export const approveUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const adminId = req.user._id;

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.role !== 'company' && user.role !== 'ngo') {
      return res.status(400).json({ msg: 'Only companies and NGOs can be approved' });
    }

    if (user.approvalStatus !== 'pending') {
      return res.status(400).json({ msg: 'User is not pending approval' });
    }

    // Update user approval status
    user.isApproved = true;
    user.approvalStatus = 'approved';
    user.approvalDate = new Date();
    user.approvedBy = adminId;
    user.rejectionReason = null;

    await user.save();

    res.json({
      success: true,
      msg: `${user.role} approved successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        approvalStatus: user.approvalStatus
      }
    });
  } catch (error) {
    console.error('Error approving user:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Reject user (company or NGO)
export const rejectUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { rejectionReason } = req.body;
    const adminId = req.user._id;

    if (!rejectionReason) {
      return res.status(400).json({ msg: 'Rejection reason is required' });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.role !== 'company' && user.role !== 'ngo') {
      return res.status(400).json({ msg: 'Only companies and NGOs can be rejected' });
    }

    if (user.approvalStatus !== 'pending') {
      return res.status(400).json({ msg: 'User is not pending approval' });
    }

    // Update user approval status
    user.isApproved = false;
    user.approvalStatus = 'rejected';
    user.approvalDate = new Date();
    user.approvedBy = adminId;
    user.rejectionReason = rejectionReason;

    await user.save();

    res.json({
      success: true,
      msg: `${user.role} rejected successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        approvalStatus: user.approvalStatus,
        rejectionReason: user.rejectionReason
      }
    });
  } catch (error) {
    console.error('Error rejecting user:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

