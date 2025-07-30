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
    } else if (file.fieldname === 'documents') {
      cb(null, 'uploads/documents');
    } else if (file.fieldname === 'receipt') {
      // You can choose one of these folders or create 'uploads/receipts'
      cb(null, 'uploads/receipts');
    } else {
      cb(new Error('Invalid fieldname'));
    }
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter function
function fileFilter(req, file, cb) {
  const extname = path.extname(file.originalname).toLowerCase().substring(1);

  if (
    (file.fieldname === 'image' && allowedImageTypes.test(extname)) ||
    (file.fieldname === 'documents' && allowedDocTypes.test(extname)) ||
    // Accept both image and document types for 'receipt'
    (file.fieldname === 'receipt' && (allowedImageTypes.test(extname) || allowedDocTypes.test(extname)))
  ) {
    cb(null, true);
  } else {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Invalid file type'));
  }
}

const upload = multer({ storage, fileFilter });

// Export specific middlewares
export const uploadReceipt = upload.single('receipt');
export const uploadMultiple = upload.fields([{ name: 'documents', maxCount: 5 }]);

export default upload;
