import mongoose from 'mongoose';
import User from './models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

const checkAdminUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find all admin users
    const adminUsers = await User.find({ role: 'admin' }).select('-password');
    
    console.log('Admin users found:', adminUsers.length);
    
    if (adminUsers.length > 0) {
      console.log('Admin users:');
      adminUsers.forEach(user => {
        console.log(`- ${user.name} (${user.email}) - Created: ${user.createdAt}`);
      });
    } else {
      console.log('No admin users found in the database.');
      console.log('You need to create an admin user first.');
    }

    // Also show all users for reference
    const allUsers = await User.find().select('-password');
    console.log('\nAll users in database:', allUsers.length);
    allUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role} - Created: ${user.createdAt}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

checkAdminUsers(); 