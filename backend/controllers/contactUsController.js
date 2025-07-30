import ContactUs from '../models/contactUsModel.js';

// Add a new contact message
export const addContactMessage = async (req, res) => {
  try {
    const { subject, firstName, lastName, email, message } = req.body;
    
    const contact = await ContactUs.create({ 
      subject, 
      firstName, 
      lastName, 
      email, 
      message 
    });
    
    res.status(201).json({ 
      success: true, 
      message: "Contact message sent successfully",
      contact 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message || 'Server error' 
    });
  }
};

// Get all contact messages
export const getAllContactMessages = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const messages = await ContactUs.find()
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await ContactUs.countDocuments();
    
    res.status(200).json({ 
      success: true, 
      messages,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message || 'Server error' 
    });
  }
};

// Get a single contact message by ID
export const getContactMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await ContactUs.findById(id);
    
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: "Contact message not found" 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: message 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message || 'Server error' 
    });
  }
};

// Delete a contact message by id
export const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await ContactUs.findByIdAndDelete(id);
    
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: "Contact message not found" 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: "Contact message deleted successfully" 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message || 'Server error' 
    });
  }
}; 