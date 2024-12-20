const express = require('express');
const router = express.Router();
const Employee= require('../models/Employee');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blacklist = new Set(); 
const authenticateToken = require('../middlewares/AuthenticateToken');

router.post('/register', async (req, res) => {
    const { Employee_id, Employee_name, Password, Phone_number, Email_id, Mac_address } = req.body;

    try {
        // Validate if all required fields are provided
        if (!Password) return res.status(400).json({ message: 'Password is required.' });

        // Check if the employee already exists
        const existingEmployee = await Employee.findOne({ $or: [{ Email_id }, { Phone_number }] });
        if (existingEmployee) return res.status(400).json({ message: 'Employee already exists.' });

        // Hash the password
        const hashedPassword = await bcrypt.hash(Password, 10).catch(err => {
            throw new Error('Error hashing password');
        });

        // Create a new employee
        const newEmployee = new Employee({
            Employee_id,
            Employee_name,
            Password: hashedPassword,
            Phone_number,
            Email_id,
            Mac_address
        });

        await newEmployee.save();
        res.status(201).json({ message: 'Employee registered successfully.' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Error registering employee.', error: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { Email_id, Password } = req.body;

    try {
        // Check if the employee exists
        const employee = await Employee.findOne({ Email_id });
        if (!employee) return res.status(404).json({ message: 'Employee not found.' });

        // Validate the password
        const isPasswordValid = await bcrypt.compare(Password, employee.Password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid email or password.' });

        // Generate JWT token
        const token = jwt.sign(
            { _id: employee._id, Employee_id: employee.Employee_id, Email_id: employee.Email_id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful.', token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in.', error:error.message });
    }
});



// Assuming blacklist is a Set initialized elsewhere in your code.


router.post('/logout', authenticateToken, (req, res) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token from Authorization header
    if (token) {
        blacklist.add(token); // Add token to blacklist (works if blacklist is a Set)
    }
    res.status(200).json({ message: 'Logged out successfully.' });
});
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


module.exports = router;
