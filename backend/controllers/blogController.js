import Blog from "../models/blogModel.js";

// Create a new blog post
export const createBlog = async (req, res) => {
  try {
    const { name, description, publicationDate, author, isPublished } = req.body;
    let image = req.body.image;
    if (req.file) {
      image = req.file.filename;
    }
    const blog = new Blog({
      name,
      description,
      image,
      publicationDate,
      author,
      isPublished: isPublished || false
    });
    await blog.save();
    res.status(201).json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all blog posts
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ publicationDate: -1 });
    res.status(200).json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single blog post by ID
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    res.status(200).json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a blog post by ID
export const updateBlog = async (req, res) => {
  try {
    console.log('Update blog request received:', {
      id: req.params.id,
      body: req.body,
      file: req.file
    });
    
    const { id } = req.params;
    const { name, description, publicationDate, author, isPublished } = req.body;
    
    // Validate required fields
    if (!name || !description || !publicationDate) {
      return res.status(400).json({ 
        success: false, 
        message: "Name, description, and publication date are required" 
      });
    }
    
    // Prepare update object
    const updateData = {
      name,
      description,
      publicationDate,
      author: author || '',
      isPublished: isPublished === 'true' || isPublished === true
    };
    
    // Only update image if a new file is uploaded
    if (req.file) {
      updateData.image = req.file.filename;
      console.log('New image uploaded:', req.file.filename);
    }
    
    console.log('Updating blog with data:', updateData);
    
    const blog = await Blog.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    
    console.log('Blog updated successfully:', blog);
    res.status(200).json({ success: true, blog });
  } catch (error) {
    console.error('Blog update error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a blog post by ID
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    res.status(200).json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}; 