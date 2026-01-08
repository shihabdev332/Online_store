import multer from 'multer';
import path from 'path';

/**
 * 1. Storage Configuration
 * Using diskStorage to store files temporarily before processing
 */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Files will be temporarily stored in the 'uploads' directory
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        // Generating a unique filename to avoid overwriting
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname).toLowerCase();
        cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
    }
});

/**
 * 2. File Type Filter
 * Critical for security: ensures only specific image formats are uploaded
 */
const fileFilter = (req, file, cb) => {
    const allowedExtensions = /jpeg|jpg|png|webp|gif/;
    const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedExtensions.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        // Rejecting non-image files
        cb(new Error('Invalid file type! Only JPG, JPEG, PNG, WEBP, and GIF are allowed.'), false);
    }
};

/**
 * 3. Multer Configuration Instance
 * Sets storage, file size limits (5MB), and the security filter
 */
const upload = multer({
    storage: storage,
    limits: { 
        fileSize: 5 * 1024 * 1024 // Maximum file size: 5MB
    }, 
    fileFilter: fileFilter
});

export default upload;