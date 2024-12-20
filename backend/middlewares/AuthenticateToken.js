
const blacklist = new Set(); 

const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization'); // Get Authorization header
    const token = authHeader?.split(' ')[1]; // Extract the token after "Bearer "

    if (!token) return res.status(401).json({ message: 'Access Denied: No token provided.' });

    // Check if the token is blacklisted
    if (blacklist.has(token)) {
        return res.status(403).json({ message: 'Access Denied: Token has been blacklisted.' });
    }

    try {
        // Verify the token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Attach user info to request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Access Denied: Token has expired.' });
        }
        return res.status(401).json({ message: 'Access Denied: Invalid token.' });
    }
};

module.exports=authenticateToken;

