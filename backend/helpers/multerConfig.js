import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Define allowed extensions for images and documents
const allowedImageTypes = /jpeg|jpg|png|gif/;
const allowedVideoTypes = /mp4|mov|avi|mkv/;
const allowedDocTypes = /pdf|doc|docx/;

// Ensure directories exist
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;
    
    if (['image', 'img', 'pic', 'images'].includes(file.fieldname)) {
      uploadPath = 'uploads/images';
    } else if (file.fieldname === 'documents') {
      uploadPath = 'uploads/documents';
    } else if (file.fieldname === 'receipt') {
      uploadPath = 'uploads/receipts';
    } else if (file.fieldname === 'video') {
      uploadPath = 'uploads/videos';
    } else {
      return cb(new Error('Invalid fieldname'));
    }
    
    // Ensure the directory exists before using it
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  }
});

// File filter function - only apply when files are actually uploaded
function fileFilter(req, file, cb) {
  console.log('Incoming file field:', file.fieldname);

  // If no file is provided, skip validation
  if (!file) {
    return cb(null, true);
  }

  const extname = path.extname(file.originalname).toLowerCase().substring(1);

  if (
    (['image', 'img', 'pic', 'images'].includes(file.fieldname) && allowedImageTypes.test(extname)) ||
    (file.fieldname === 'documents' && allowedDocTypes.test(extname)) ||
    (file.fieldname === 'receipt' && (allowedImageTypes.test(extname) || allowedDocTypes.test(extname))) ||
    (file.fieldname === 'video' && allowedVideoTypes.test(extname))
  ) {
    cb(null, true);
  } else {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
  }
}

// Function to copy file to company_ngo folder if user is a company
const copyToCompanyFolder = (filePath, filename) => {
  return new Promise((resolve, reject) => {
    const companyNgoDir = 'uploads/company_ngo';
    ensureDirectoryExists(companyNgoDir);

    const sourcePath = filePath;
    const destPath = path.join(companyNgoDir, filename);

    fs.copyFile(sourcePath, destPath, (err) => {
      if (err) {
        console.error('Error copying file to company_ngo folder:', err);
        reject(err);
      } else {
        console.log(`File copied to company_ngo folder: ${destPath}`);
        resolve(destPath);
      }
    });
  });
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Export specific middlewares
export const uploadReceipt = upload.single('receipt');
export const uploadMultiple = upload.fields([{ name: 'documents', maxCount: 5 }]);
export { copyToCompanyFolder };

export default upload;