const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const jobController = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware

// ✅ Multer config for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Save uploaded files in uploads folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});
const upload = multer({ storage: storage });

// ✅ Save extracted job manually (protected route)
router.post('/add', protect, jobController.saveJob);

// ✅ Extract job info from description or PDF (protected route)
router.post('/extract', protect, upload.single('file'), jobController.extractJobInfo);

// ✅ Get all jobs for the logged-in user
router.get('/', protect, jobController.getUserJobs);


router.delete('/delete/:id', protect, jobController.deleteJob);

module.exports = router;
