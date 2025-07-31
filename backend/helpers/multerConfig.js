import multer from 'multer';
import path from 'path';

// Define allowed extensions for images and documents
const allowedImageTypes = /jpeg|jpg|png|gif/;
const allowedDocTypes = /pdf|doc|docx/;

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'image') {
      cb(null, 'uploads/images');
    } else if (file.fieldname === 'img') {
      cb(null, 'uploads/images');
    } else if (file.fieldname === 'pic') {
      cb(null, 'uploads/images');
    } else if (file.fieldname === 'images') {
      cb(null, 'uploads/images');
    } else if (file.fieldname === 'documents') {
      cb(null, 'uploads/documents');
    } else if (file.fieldname === 'receipt') {
      cb(null, 'uploads/receipts');
    } else {
      cb(new Error('Invalid fieldname'));
    }
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  }
});

// File filter function - only apply when files are actually uploaded
function fileFilter(req, file, cb) {
  // If no file is provided, skip validation
  if (!file) {
    return cb(null, true);
  }

  const extname = path.extname(file.originalname).toLowerCase().substring(1);

  if (
    ((file.fieldname === 'image' || file.fieldname === 'img' || file.fieldname === 'pic' || file.fieldname === 'images') && allowedImageTypes.test(extname)) ||
    (file.fieldname === 'documents' && allowedDocTypes.test(extname)) ||
    (file.fieldname === 'receipt' && (allowedImageTypes.test(extname) || allowedDocTypes.test(extname)))
  ) {
    cb(null, true);
  } else {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Invalid file type'));
  }
}

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

export default upload;
