import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Event from '../models/eventModel.js';
import Program from '../models/programModel.js';
import mongoose from 'mongoose';

// Register
export const registerUser = async (req, res) => {
  try {
    console.log(req.body)
    const { name, email, password, role, phone, address,  } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User Already exists' });
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

    // Add image path if file was uploaded
    if (req.file) {
      userData.image = req.file.path; // or req.file.filename if you prefer just the filename
    }

    // Add documents if files were uploaded (for NGO role)
    if (req.files && req.files.length > 0) {
      userData.documents = req.files.map(file => file.path);
    }

    // Create user
    user = await User.create(userData);

    res.status(201).json({ 
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
    res.status(500).json({ msg: 'Server error' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const {userId} = req.body;
    const { name, address, phone, role } = req.body;
    console.log(req.body)

    // Prepare update data
    const updatedData = {};

    if (name) updatedData.name = name;
    if (address) updatedData.address = address;
    if (phone) updatedData.phone = phone;
    if (role) updatedData.role = role;
    
    // If image is uploaded
    if (req.file) {
      updatedData.image = req.file.path; // or req.file.filename if preferred
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

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ msg: 'Login successful', token, role: user.role });
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
  const users = await User.find().select('-password');
  res.json(users);
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

