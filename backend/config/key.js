module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'defaultsecretkey',
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/mernapp',
};