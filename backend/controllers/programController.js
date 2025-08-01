import Program from "../models/programModel.js";
import User from "../models/userModel.js";
import upload from "../helpers/multerConfig.js";

// Create a new program
export const createProgram = async (req, res) => {
  try {
    console.log('Create program request received:', {
      body: req.body,
      file: req.file,
      user: req.user
    });
    
    const { title, description, startingDate, endingDate, day, time } = req.body;
    
    // Validate required fields
    if (!title || !description || !startingDate || !endingDate || !day || !time) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields (title, description, startingDate, endingDate, day, time) are required" 
      });
    }
    
    let image = null;
    if (req.file) {
      image = req.file.filename;
      console.log('Image uploaded:', req.file.filename);
    }
    
    // If user is a company, associate the program with the company
    let companyId = null;
    if (req.user && req.user.role === 'company') {
      companyId = req.user._id;
    }
    
    const program = new Program({ 
      title, 
      description, 
      startingDate, 
      endingDate, 
      image, 
      day, 
      time,
      companyId 
    });
    await program.save();
    
    console.log('Program created successfully:', program);
    res.status(201).json({ success: true, program });
  } catch (error) {
    console.error('Program creation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Update a program by ID
export const updateProgram = async (req, res) => {
  try {
    console.log('Update program request received:', {
      id: req.params.id,
      body: req.body,
      file: req.file,
      user: req.user
    });
    
    const { id } = req.params;
    const { title, description, startingDate, endingDate, day, time } = req.body;
    
    // Validate required fields
    if (!title || !description || !startingDate || !endingDate || !day || !time) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields (title, description, startingDate, endingDate, day, time) are required" 
      });
    }

    // First, get the program to check ownership
    const existingProgram = await Program.findById(id);
    if (!existingProgram) {
      return res.status(404).json({ success: false, message: "Program not found" });
    }

    // If user is a company, check if they own this program
    if (req.user.role === 'company' && existingProgram.companyId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied. You can only update your own programs.' });
    }
    
    // Prepare update object
    const updateData = {
      title,
      description,
      startingDate,
      endingDate,
      day,
      time
    };
    
    // Only update image if a new file is uploaded
    if (req.file) {
      updateData.image = req.file.filename;
      console.log('New image uploaded:', req.file.filename);
    }
    
    console.log('Updating program with data:', updateData);
    
    const program = await Program.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    console.log('Program updated successfully:', program);
    res.status(200).json({ success: true, program });
  } catch (error) {
    console.error('Program update error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get all programs (filtered by company if user is a company, or all programs if not authenticated)
export const getAllPrograms = async (req, res) => {
  try {
    console.log('=== getAllPrograms called ===');
    console.log('Request user:', req.user);
    console.log('Request headers:', req.headers);
    console.log('Request URL:', req.url);
    
    let query = {};
    
    // If user is authenticated and is a company, only show their programs
    if (req.user && req.user.role === 'company') {
      // Use _id from JWT token
      const userId = req.user._id;
      query.companyId = userId;
      console.log('✅ Filtering programs for company:', userId, req.user.name);
      console.log('User ID type:', typeof userId);
      console.log('User ID value:', userId);
      console.log('Query:', query);
    } else {
      console.log('❌ No user or not a company, showing all programs');
      console.log('User role:', req.user?.role);
      console.log('User object:', req.user);
    }
    
    const programs = await Program.find(query).populate('companyId', 'name email');
    console.log(`📊 Found ${programs.length} programs for query:`, query);
    console.log('Programs:', programs.map(p => ({ id: p._id, title: p.title, companyId: p.companyId })));
    
    res.status(200).json({ success: true, programs });
    
  } catch (error) {
    console.error('❌ Error in getAllPrograms:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all programs for admin (shows all programs with company names)
export const getAllProgramsForAdmin = async (req, res) => {
  try {
    const programs = await Program.find().populate('companyId', 'name email role');
    res.status(200).json({ success: true, programs });
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get program by ID
export const getProgramById = async (req, res) => {
  try {
    const { id } = req.params;
    const program = await Program.findById(id);
    if (!program) {
      return res.status(404).json({ success: false, message: "Program not found" });
    }
    res.status(200).json({ success: true, program });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete program by ID
export const deleteProgram = async (req, res) => {
  try {
    const { id } = req.params;
    
    // First, get the program to check ownership
    const program = await Program.findById(id);
    if (!program) {
      return res.status(404).json({ success: false, message: "Program not found" });
    }

    // If user is a company, check if they own this program
    if (req.user.role === 'company' && program.companyId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied. You can only delete your own programs.' });
    }

    await Program.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Program deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a participant to a progr

export const addParticipant = async (req, res) => {
  try {
    const { programId } = req.params;
    const { userId } = req.body;

    const program = await Program.findById(programId);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    // Fetch user and check role
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const role = user.role?.toLowerCase();
    if (role === 'company' || role === 'ngo') {
      return res.status(403).json({ success: false, message: 'Companies and NGOs cannot register as participants' });
    }

    // Check if user already joined
    const alreadyParticipant = program.participants.includes(userId);
    if (alreadyParticipant) {
      return res.status(400).json({ success: false, message: 'You are already registered for this program' });
    }

    // Add user to participants
    program.participants.push(userId);
    await program.save();

    const populatedProgram = await Program.findById(programId).populate('participants', 'name email phone');

    return res.status(200).json({ success: true, message: 'Successfully registered', program: populatedProgram });

  } catch (error) {
    console.error("Program participation error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Remove a participant from a program
export const removeParticipant = async (req, res) => {
  try {
    const { programId } = req.params;
    const { userId } = req.body;
    
    // First, get the program to check ownership
    const program = await Program.findById(programId);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }
    
    // If user is a company, check if they own this program
    if (req.user.role === 'company' && program.companyId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied. You can only manage participants for your own programs.' });
    }
    
    const updatedProgram = await Program.findByIdAndUpdate(
      programId,
      { $pull: { participants: userId } },
      { new: true }
    ).populate('participants', 'name email phone');
    
    res.status(200).json({ success: true, message: 'Participant removed successfully', program: updatedProgram });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all participants for a program
export const getParticipants = async (req, res) => {
  try {
    const { programId } = req.params;
    
    // First, get the program to check ownership
    const program = await Program.findById(programId);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }
    
    // If user is a company, check if they own this program
    if (req.user.role === 'company' && program.companyId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied. You can only view participants for your own programs.' });
    }
    
    const populatedProgram = await Program.findById(programId).populate('participants', 'name email phone role');
    
    res.status(200).json({ 
      success: true, 
      participants: populatedProgram.participants,
      totalParticipants: populatedProgram.participants.length,
      programTitle: populatedProgram.title
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all programs with their participants count (filtered by company if user is a company, or all programs if not authenticated)
export const getAllProgramsWithParticipants = async (req, res) => {
  try {
    let query = {};
    
    // If user is authenticated and is a company, only show their programs
    if (req.user && req.user.role === 'company') {
      query.companyId = req.user._id;
    }
    
    const programs = await Program.find(query)
      .populate('participants', 'name email phone role')
      .populate('companyId', 'name email');
      
    const programsWithStats = programs.map(program => ({
      _id: program._id,
      title: program.title,
      description: program.description,
      startingDate: program.startingDate,
      endingDate: program.endingDate,
      day: program.day,
      time: program.time,
      image: program.image,
      companyId: program.companyId,
      companyName: program.companyId ? program.companyId.name : 'Admin Created',
      participants: program.participants,
      totalParticipants: program.participants.length
    }));
    
    res.status(200).json({ 
      success: true, 
      programs: programsWithStats,
      totalPrograms: programs.length,
      totalParticipantsAcrossAllPrograms: programs.reduce((sum, program) => sum + program.participants.length, 0)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get company dashboard stats
export const getCompanyDashboardStats = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'company') {
      return res.status(403).json({ success: false, message: 'Access denied. Company role required.' });
    }
    
    const companyId = req.user._id;
    
    // Get all programs by this company
    const programs = await Program.find({ companyId }).populate('participants', 'name email phone role');
    
    // Calculate stats
    const totalPrograms = programs.length;
    const totalParticipants = programs.reduce((sum, program) => sum + program.participants.length, 0);
    const activePrograms = programs.filter(program => new Date(program.endingDate) > new Date()).length;
    
    // Get recent registrations (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentRegistrations = programs.reduce((count, program) => {
      return count + program.participants.filter(participant => 
        new Date(participant.createdAt) > sevenDaysAgo
      ).length;
    }, 0);
    
    res.status(200).json({
      success: true,
      stats: {
        totalPrograms,
        totalParticipants,
        activePrograms,
        recentRegistrations
      },
      programs: programs.slice(0, 5) // Return latest 5 programs
    });
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}; 

// Test endpoint for debugging
export const testEndpoint = async (req, res) => {
  try {
    console.log('Test endpoint called');
    console.log('User:', req.user);
    console.log('Headers:', req.headers);
    
    const programs = await Program.find().populate('companyId', 'name email');
    console.log('Total programs found:', programs.length);
    
    // Check all programs and their companyId
    const programDetails = programs.map(program => ({
      id: program._id,
      title: program.title,
      companyId: program.companyId,
      hasCompanyId: !!program.companyId
    }));
    
    console.log('Program details:', programDetails);
    
    res.status(200).json({ 
      success: true, 
      message: 'Test endpoint working',
      user: req.user,
      totalPrograms: programs.length,
      programs: programs.slice(0, 3), // Return first 3 programs for debugging
      programDetails: programDetails
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}; 