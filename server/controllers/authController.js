const User = require('../models/User');
const jwt = require('jsonwebtoken');
const path = require('path');
const bcrypt = require('bcryptjs');

const createToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

exports.signup = async (req, res) => {
  try {
    const { name, username, highestQualification, email, password } = req.body;

    // Check all required fields
    if (!name || !username || !highestQualification || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Check for duplicate email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    // Check for duplicate username
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Handle files (profile pic & resume)
    const profilePicFile = req.files?.profile_pic?.[0];
    const resumeFile = req.files?.resume?.[0];

    const profilePicPath = profilePicFile
      ? `/uploads/profile_pics/${path.basename(profilePicFile.path)}`
      : "/uploads/profile_pics/profile.svg";

    const resumePath = resumeFile
      ? `/uploads/resumes/${path.basename(resumeFile.path)}`
      : "";

    // Create user
    const user = await User.create({
      name,
      username,
      highestQualification,
      email,
      password: hashedPassword,
      profilePic: profilePicPath,
      resume: resumePath,
    });

    res.status(201).json({ success: true, message: 'Signup successful!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Signup failed!', error: err.message });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    // If user doesn't exist
    if (!user) {
      return res.status(401).json({ success: false, message: 'User Not Found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Wrong Password' });
    }

    const token = createToken(user);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        highestQualification: user.highestQualification,
        username: user.username,
        resume: user.resume,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Login failed', error: err.message });
  }
};
