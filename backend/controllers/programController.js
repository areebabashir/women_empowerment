import Program from "../models/programModel.js";
import upload from "../helpers/multerConfig.js";

// Create a new program
export const createProgram = async (req, res) => {
  try {
    console.log('Create program request received:', {
      body: req.body,
      file: req.file
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
    
    const program = new Program({ title, description, startingDate, endingDate, image, day, time });
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
      file: req.file
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
    
    if (!program) {
      return res.status(404).json({ success: false, message: "Program not found" });
    }
    
    console.log('Program updated successfully:', program);
    res.status(200).json({ success: true, program });
  } catch (error) {
    console.error('Program update error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get all programs
export const getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find();
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
    const program = await Program.findByIdAndDelete(id);
    if (!program) {
      return res.status(404).json({ success: false, message: "Program not found" });
    }
    res.status(200).json({ success: true, message: "Program deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a participant to a progr

export const addParticipant = async (req, res) => {
  try {
    const { programId } = req.params;
    const {userId} = req.body

    const program = await Program.findById(programId);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
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
    
    const program = await Program.findByIdAndUpdate(
      programId,
      { $pull: { participants: userId } },
      { new: true }
    ).populate('participants', 'name email phone');
    
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }
    res.status(200).json({ success: true, message: 'Participant removed successfully', program });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all participants for a program
export const getParticipants = async (req, res) => {
  try {
    const { programId } = req.params;
    const program = await Program.findById(programId).populate('participants', 'name email phone role');
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }
    res.status(200).json({ 
      success: true, 
      participants: program.participants,
      totalParticipants: program.participants.length,
      programTitle: program.title
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all programs with their participants count
export const getAllProgramsWithParticipants = async (req, res) => {
  try {
    const programs = await Program.find().populate('participants', 'name email phone role');
    const programsWithStats = programs.map(program => ({
      _id: program._id,
      title: program.title,
      description: program.description,
      startingDate: program.startingDate,
      endingDate: program.endingDate,
      day: program.day,
      time: program.time,
      image: program.image,
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