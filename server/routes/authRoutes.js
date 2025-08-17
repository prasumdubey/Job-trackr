const express = require('express');
const { signup, login } = require('../controllers/authController');
const upload = require('../middleware/uploadMiddleware'); // your multer config file

const router = express.Router();

router.post(
  '/signup',
  upload.fields([
    { name: 'profile_pic', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
  ]),
  signup
);

router.post('/login', login);

module.exports = router;

