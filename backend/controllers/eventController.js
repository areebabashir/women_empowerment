import Event from "../models/eventModel.js";
import upload from "../helpers/multerConfig.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";



// Create a new event
export const createEvent = async (req, res) => {
  try {
    console.log('Create event request received:', {
      body: req.body,
      file: req.file
    });
    
    const { title, description, date, day, time } = req.body;
    
    // Validate required fields
    if (!title || !description || !date || !day || !time) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields (title, description, date, day, time) are required" 
      });
    }
    
    let image = null;
    if (req.file) {
      image = req.file.filename;
      console.log('Image uploaded:', req.file.filename);
    }
    
    const event = new Event({ title, description, date, image, day, time });
    await event.save();
    
    console.log('Event created successfully:', event);
    res.status(201).json({ success: true, event });
  } catch (error) {
    console.error('Event creation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Update an event by ID
export const updateEvent = async (req, res) => {
  try {
    console.log('Update event request received:', {
      id: req.params.id,
      body: req.body,
      file: req.file
    });
    
    const { id } = req.params;
    const { title, description, date, day, time, isPublished } = req.body;
    
    // Validate required fields
    if (!title || !description || !date || !day || !time) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields (title, description, date, day, time) are required" 
      });
    }
    
    // Prepare update object
    const updateData = {
      title,
      description,
      date,
      day,
      time,
      isPublished: isPublished === 'true' || isPublished === true
    };
    
    // Only update image if a new file is uploaded
    if (req.file) {
      updateData.image = req.file.filename;
      console.log('New image uploaded:', req.file.filename);
    }
    
    console.log('Updating event with data:', updateData);
    
    const event = await Event.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    
    console.log('Event updated successfully:', event);
    res.status(200).json({ success: true, event });
  } catch (error) {
    console.error('Event update error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get event by ID
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    res.status(200).json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete event by ID
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    res.status(200).json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a participant to an event


export const addParticipant = async (req, res) => {
  try {
    const { eventId } = req.params;
    const {userId} = req.body

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check if user is already a participant
    const alreadyParticipant = event.participants.includes(userId);
    if (alreadyParticipant) {
      return res.status(400).json({ success: false, message: 'You are already registered for this event' });
    }

    // Add participant
    event.participants.push(userId);
    await event.save();

    const populatedEvent = await Event.findById(eventId).populate('participants', 'name email phone');

    return res.status(200).json({ success: true, message: 'Successfully registered', event: populatedEvent });
  } catch (error) {
    console.error("addParticipant error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove a participant from an event
export const removeParticipant = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId } = req.body;
    
    const event = await Event.findByIdAndUpdate(
      eventId,
      { $pull: { participants: userId } },
      { new: true }
    ).populate('participants', 'name email phone role');
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, message: 'Participant removed successfully', event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all participants for an event
export const getParticipants = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId).populate('participants', 'name email phone role');
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ 
      success: true, 
      participants: event.participants,
      totalParticipants: event.participants.length,
      eventTitle: event.title
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all events with their participants count
export const getAllEventsWithParticipants = async (req, res) => {
  try {
    const events = await Event.find().populate('participants', 'name email phone role');
    const eventsWithStats = events.map(event => ({
      _id: event._id,
      title: event.title,
      description: event.description,
      date: event.date,
      day: event.day,
      time: event.time,
      image: event.image,
      participants: event.participants,
      totalParticipants: event.participants.length
    }));
    
    res.status(200).json({ 
      success: true, 
      events: eventsWithStats,
      totalEvents: events.length,
      totalParticipantsAcrossAllEvents: events.reduce((sum, event) => sum + event.participants.length, 0)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
