import fs from 'fs';
import path from 'path';

const testUploadsDirectory = () => {
  console.log('=== Testing Uploads Directory Structure ===');
  
  const uploadsPath = './uploads';
  const imagesPath = './uploads/images';
  const documentsPath = './uploads/documents';
  const videoPath = './uploads/video';
  
  // Check if directories exist
  console.log('Checking directory existence:');
  console.log(`uploads: ${fs.existsSync(uploadsPath) ? '✅ EXISTS' : '❌ MISSING'}`);
  console.log(`images: ${fs.existsSync(imagesPath) ? '✅ EXISTS' : '❌ MISSING'}`);
  console.log(`documents: ${fs.existsSync(documentsPath) ? '✅ EXISTS' : '❌ MISSING'}`);
  console.log(`video: ${fs.existsSync(videoPath) ? '✅ EXISTS' : '❌ MISSING'}`);
  
  // List files in images directory
  if (fs.existsSync(imagesPath)) {
    console.log('\nFiles in images directory:');
    try {
      const files = fs.readdirSync(imagesPath);
      if (files.length === 0) {
        console.log('  📁 Directory is empty');
      } else {
        files.forEach(file => {
          const filePath = path.join(imagesPath, file);
          const stats = fs.statSync(filePath);
          console.log(`  📄 ${file} (${stats.size} bytes)`);
        });
      }
    } catch (error) {
      console.log(`  ❌ Error reading images directory: ${error.message}`);
    }
  }
  
  // List files in documents directory
  if (fs.existsSync(documentsPath)) {
    console.log('\nFiles in documents directory:');
    try {
      const files = fs.readdirSync(documentsPath);
      if (files.length === 0) {
        console.log('  📁 Directory is empty');
      } else {
        files.forEach(file => {
          const filePath = path.join(documentsPath, file);
          const stats = fs.statSync(filePath);
          console.log(`  📄 ${file} (${stats.size} bytes)`);
        });
      }
    } catch (error) {
      console.log(`  ❌ Error reading documents directory: ${error.message}`);
    }
  }
  
  console.log('\n=== Test Complete ===');
};

testUploadsDirectory(); 