import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js'; // Importing routes
import eventRoute from './routes/eventRoute.js'; // Importing event routes
import blogRoute from './routes/blogRoute.js'; // Importing blog routes
import teamRoute from './routes/teamRoute.js'; // Importing team routes
import programRoute from './routes/programRoute.js'; // Importing program routes
import successStoryRoute from './routes/successStoryRoute.js'; // Importing success story routes
import contactUsRoute from './routes/contactUsRoute.js';
import galleryRoute from './routes/galleryRoute.js';
import podcastRoute from './routes/podcastRoute.js';
import donationRoute from "./routes/donationRoute.js"
import awarenessRoute from './routes/awarenessRoute.js';
import jobRoutes from './routes/jobRoute.js';

import fs from 'fs';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));
app.use('/api/uploads', express.static('uploads'));

// Routes

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoute);
app.use('/api/blogs', blogRoute);
app.use('/api/teams', teamRoute);
app.use('/api/programs', programRoute);
app.use('/api/successstories', successStoryRoute);
app.use('/api/contactus', contactUsRoute);  
app.use('/api/gallery', galleryRoute);
app.use('/api/podcasts', podcastRoute);
app.use('/api/donations' , donationRoute);
app.use('/api/awareness', awarenessRoute);
app.use('/api/jobs', jobRoutes);
app.get('/api/partner-logos', (req, res) => {
  console.log("req hittt")
  const folderPath = path.join(__dirname, 'uploads', 'company_ngo');


  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return res.status(500).json({ msg: 'Unable to read logos directory' });
    }

    const imageUrls = files.map(file => `/uploads/company_ngo/${file}`);
    console.log(imageUrls)
    res.json(imageUrls);
  });
});


// Set the PORT from environment variables or default to 8000
const PORT = process.env.PORT || 8000;

// Start server
app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});

