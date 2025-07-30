import Podcast from "../models/podcastModel.js";

// Create a new podcast episode
export const createPodcast = async (req, res) => {
  try {
    const { name, episodeNumber, guest, description, duration, isPublished } = req.body;
    
    let video = req.body.video;
    if (req.file) {
      video = req.file.filename;
    }
    
    const podcast = new Podcast({
      name,
      episodeNumber,
      video,
      guest,
      description,
      duration,
      isPublished: isPublished || false
    });
    
    await podcast.save();
    res.status(201).json({ success: true, podcast });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all podcast episodes
export const getAllPodcasts = async (req, res) => {
  try {
    const { page = 1, limit = 10, published } = req.query;
    
    let query = {};
    if (published === 'true') {
      query.isPublished = true;
    }
    
    const podcasts = await Podcast.find(query)
      .sort({ episodeNumber: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Podcast.countDocuments(query);
    
    res.status(200).json({ 
      success: true, 
      podcasts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single podcast episode by ID
export const getPodcastById = async (req, res) => {
  try {
    const { id } = req.params;
    const podcast = await Podcast.findById(id);
    if (!podcast) {
      return res.status(404).json({ success: false, message: "Podcast not found" });
    }
    res.status(200).json({ success: true, podcast });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get podcast by episode number
export const getPodcastByEpisode = async (req, res) => {
  try {
    const { episodeNumber } = req.params;
    const podcast = await Podcast.findOne({ episodeNumber: parseInt(episodeNumber) });
    if (!podcast) {
      return res.status(404).json({ success: false, message: "Podcast episode not found" });
    }
    res.status(200).json({ success: true, podcast });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a podcast episode by ID
export const updatePodcast = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, episodeNumber, guest, description, duration, isPublished } = req.body;
    
    let updateData = { name, episodeNumber, guest, description, duration, isPublished };
    
    if (req.file) {
      updateData.video = req.file.filename;
    }
    
    const podcast = await Podcast.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!podcast) {
      return res.status(404).json({ success: false, message: "Podcast not found" });
    }
    
    res.status(200).json({ success: true, podcast });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a podcast episode by ID
export const deletePodcast = async (req, res) => {
  try {
    const { id } = req.params;
    const podcast = await Podcast.findByIdAndDelete(id);
    if (!podcast) {
      return res.status(404).json({ success: false, message: "Podcast not found" });
    }
    res.status(200).json({ success: true, message: "Podcast deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Publish/Unpublish a podcast
export const togglePodcastPublish = async (req, res) => {
  try {
    const { id } = req.params;
    const podcast = await Podcast.findById(id);
    
    if (!podcast) {
      return res.status(404).json({ success: false, message: "Podcast not found" });
    }
    
    podcast.isPublished = !podcast.isPublished;
    podcast.publishDate = podcast.isPublished ? new Date() : null;
    
    await podcast.save();
    
    res.status(200).json({ 
      success: true, 
      podcast,
      message: podcast.isPublished ? "Podcast published successfully" : "Podcast unpublished successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}; 