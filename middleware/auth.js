const config = require('config');
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
	const token = req.header('x-auth-token');

	// Check for token
	if (!token) {
		res.status(401).json({
			success: false,
			message: 'No token, authorisation denied'
		});
	}

	try {
		// Verfiy token
		const decoded = jwt.verify(token, config.get('jwtSecret'));

		// Add user from payload
		req.user = decoded;
		next();
	} catch (error) {
		res.status(400).json({
			success: false,
			message: 'Token is not valid'
		});
	}
};

module.exports = auth;
