import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Test route to check if images are accessible
app.get('/test-image/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join('uploads', 'images', filename);
  
  if (fs.existsSync(imagePath)) {
    res.sendFile(path.resolve(imagePath));
  } else {
    res.status(404).json({ 
      error: 'Image not found',
      path: imagePath,
      exists: fs.existsSync(imagePath)
    });
  }
});

// List all images in uploads/images
app.get('/list-images', (req, res) => {
  const imagesDir = 'uploads/images';
  
  if (!fs.existsSync(imagesDir)) {
    return res.json({ error: 'Images directory does not exist' });
  }
  
  try {
    const files = fs.readdirSync(imagesDir);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
    });
    
    res.json({
      directory: imagesDir,
      totalFiles: files.length,
      imageFiles: imageFiles,
      imageUrls: imageFiles.map(file => `http://localhost:8000/uploads/images/${file}`)
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

const PORT = 8001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Test image access: http://localhost:${PORT}/list-images`);
}); 