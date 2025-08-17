const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

ensureDir(path.join(__dirname, '../uploads/profile_pics'));
ensureDir(path.join(__dirname, '../uploads/resumes'));

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'profile_pic') {
      cb(null, path.join(__dirname, '../uploads/profile_pics'));
    } else if (file.fieldname === 'resume') {
      cb(null, path.join(__dirname, '../uploads/resumes'));
    } else {
      cb(new Error('Invalid field name'), false);
    }
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + '-' + file.originalname.toLowerCase().replace(/\s+/g, '_')
    );
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'resume') {
    // Only PDFs for resumes
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Resume must be a PDF'), false);
  } else if (file.fieldname === 'profile_pic') {
    // Allow common image formats
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Profile picture must be JPG or PNG'), false);
    }
  } else {
    cb(new Error('Unknown field'), false);
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 20 * 1024 * 1024 }});

module.exports = upload;
