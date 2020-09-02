const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

// User Model
const User = require('../models/User');

// @route   POST api/users
// @desc    Register new user
// @access  Public
router.post('/', async (req, res) => {
	try {
		const { name, email, password } = req.body;

		// Simple validation
		if (!name || !email || !password) {
			return res.status(400).json({
				success: false,
				message: 'Please enter all fields'
			});
		}

		// Check for existing user
		const user = await User.findOne({ email });
		if (user) {
			return res.status(400).json({
				success: false,
				message: 'User already exists'
			});
		}

		const newUser = new User({ name, email, password });

		// Create salt and hash
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(newUser.password, salt, async (err, hash) => {
				if (err) throw err;
				newUser.password = hash;
				const user = await newUser.save();

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
			});
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			error: 'Server Error'
		});
	}
});

module.exports = router;
