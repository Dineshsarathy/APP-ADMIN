const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
  try {
    // Log all incoming headers
    console.log('Incoming Headers:', req.headers);

    // Extract the token from the Authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      console.log('Authorization header is missing');
      return res.status(401).json({ message: 'Access Denied: No token provided' });
    }

    // Extract the token with or without "Bearer" prefix
    let token;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7).trim();
    } else {
      // If "Bearer" is not present, assume the entire header value is the token
      token = authHeader.trim();
    }

    if (!token) {
      console.log('Invalid Authorization header format');
      return res.status(401).json({ message: 'Access Denied: Invalid token format' });
    }

    console.log('Token received:', token);

    // Verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified successfully:', verified);

    // Attach the decoded token payload to the request object
    req.user = verified;

    next(); // Proceed to the next middleware
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.error('Token verification error: Token expired');
      return res.status(401).json({ message: 'Invalid token: Token has expired' });
    } else if (err.name === 'JsonWebTokenError') {
      console.error('Token verification error: Invalid token');
      return res.status(400).json({ message: 'Invalid token' });
    } else {
      console.error('Token verification error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = verifyToken;
