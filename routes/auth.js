const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// User Model
const User = require('../models/User');

// @route   POST api/auth
// @desc    Authenticate user
// @access  Public
router.post('/', async (req, res) => {
	try {
		const { email, password } = req.body;

		// Simple validation
		if (!email || !password) {
			return res.status(400).json({
				success: false,
				message: 'Please enter all fields'
			});
		}

		// Check for existing user
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User doesn't exist"
			});
		}

		// Validate password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({
				success: false,
				message: 'Invalid credentials'
			});
		}
		jwt.sign({ id: user._id }, config.get('jwtSecret'), { expiresIn: 3600 }, (err, token) => {
			if (err) throw err;

			res.status(200).json({
				success: true,
				token,
				user: {
					id: user._id,
					name: user.name,
					email: user.email
				}
			});
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			error: 'Server Error'
		});
	}
});

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');

		return res.status(200).json({
			success: true,
			user
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			error: 'Server Error'
		});
	}
});

module.exports = router;
