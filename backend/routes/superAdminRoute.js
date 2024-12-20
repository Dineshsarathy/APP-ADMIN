const express = require('express');
const jwt = require('jsonwebtoken');
const blacklist = new Set(); // Example for token blacklist (can be stored in a database)
const bcrypt = require('bcryptjs');
const router = express.Router();
const SuperAdmin = require('../models/SuperAdmin');
const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
dotenv.config();


// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const superadmin = await SuperAdmin.findOne({ email });
    if (!superadmin) return res.status(400).send('Invalid email or password');

    // Validate password
    const validPassword = await bcrypt.compare(password, superadmin.password);
    if (!validPassword) return res.status(400).send('Invalid email or password');

    // Generate token
    const token = jwt.sign({ _id: superadmin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.header('Authorization', token).send({ token });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Register Route
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const existingAdmin = await SuperAdmin.findOne({ email });
    if (existingAdmin) return res.status(400).send('Super Admin already exists');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save new admin
    const admin = new SuperAdmin({ email, password: hashedPassword });
    await admin.save();

    res.send('Super Admin registered successfully');
  } catch (err) {
    res.status(500).send('Error registering Super Admin');
  }
});

// Logout API
router.post('/logout', async (req, res) => {
  const token = req.header('Authorization'); // Retrieve token from headers

  if (!token) return res.status(401).send('No token provided');

  try {
    // Verify if the token is valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add token to the blacklist (example)
    blacklist.add(token);

    res.status(200).send('Logged out successfully');
  } catch (err) {
    res.status(400).send('Invalid token');
  }
});

// Middleware to check blacklisted tokens
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (blacklist.has(token)) return res.status(403).send('Token is invalid');
  
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).send('Access Denied');
  }
};

//Forgot Password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await SuperAdmin.findOne({ email });
    if (!user) return res.status(404).send("User not found");

    // Generate reset token
    const resetToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: 'smtp.gmail.com',  
      port: 587,  
      secure: false,
      auth: {
        user: "dhamotharansridhar93@gmail.com",
        pass: "ngat xzfq sieg nmag",
      },
      
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      html: `<p>Click the link to reset your password: <a href="http://localhost:3000/reset-password/${resetToken}">Reset Password</a></p>`,
    };

    await transporter.sendMail(mailOptions);

    res.send("Password reset link sent to your email.");
  } catch (err) {
    res.status(500).send("Error sending reset link.");
  }

});
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await SuperAdmin.findByIdAndUpdate(decoded._id, { password: hashedPassword });

    res.send("Password reset successfully.");
  } catch (err) {
    res.status(400).send("Invalid or expired token.");
  }
});

  
  module.exports = router;