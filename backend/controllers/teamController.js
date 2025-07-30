import Team from '../models/teamModel.js';

// Get all team members
export const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find();
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get team member by ID
export const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team member not found' });
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new team member
export const addTeamMember = async (req, res) => {
  try {
    console.log('Add team request received:', {
      body: req.body,
      file: req.file
    });
    
    const { name, position, bio } = req.body;
    
    // Validate required fields
    if (!name || !position) {
      return res.status(400).json({ 
        success: false, 
        message: "Name and position are required" 
      });
    }
    
    let pic = null;
    if (req.file) {
      pic = req.file.filename;
      console.log('Image uploaded:', req.file.filename);
    } else {
      // Use a default image if none provided
      pic = 'default-team-member.jpg';
      console.log('No image provided, using default');
    }
    
    const newTeam = new Team({ 
      name, 
      position, 
      pic, 
      bio: bio || '' 
    });
    
    await newTeam.save();
    
    console.log('Team member created successfully:', newTeam);
    res.status(201).json({ success: true, team: newTeam });
  } catch (error) {
    console.error('Team creation error:', error);
    
    // Handle specific validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false, 
        message: "Validation error", 
        errors: validationErrors 
      });
    }
    
    res.status(500).json({ success: false, message: error.message });
  }
};

// Edit a team member
export const editTeam = async (req, res) => {
  try {
    console.log('Update team request received:', {
      id: req.params.id,
      body: req.body,
      file: req.file
    });
    
    const { name, position, bio } = req.body;
    
    // Validate required fields
    if (!name || !position) {
      return res.status(400).json({ 
        success: false, 
        message: "Name and position are required" 
      });
    }
    
    // Prepare update data
    const updateData = {
      name,
      position,
      bio: bio || ''
    };
    
    // Only update image if a new file is uploaded
    if (req.file) {
      updateData.pic = req.file.filename;
      console.log('New image uploaded:', req.file.filename);
    }
    
    console.log('Updating team with data:', updateData);
    
    const updatedTeam = await Team.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedTeam) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }
    
    console.log('Team updated successfully:', updatedTeam);
    res.status(200).json({ success: true, team: updatedTeam });
  } catch (error) {
    console.error('Team update error:', error);
    
    // Handle specific validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false, 
        message: "Validation error", 
        errors: validationErrors 
      });
    }
    
    // Handle MongoDB errors
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid team member ID format" 
      });
    }
    
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a team member by ID
export const deleteTeamById = async (req, res) => {
  try {
    const deletedTeam = await Team.findByIdAndDelete(req.params.id);
    if (!deletedTeam) return res.status(404).json({ message: 'Team member not found' });
    res.status(200).json({ message: 'Team member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 