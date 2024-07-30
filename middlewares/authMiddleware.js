// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Bearer <token>
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Forbidden if token is invalid
            }
            req.user = user;
            next(); // Proceed to the next middleware
        });
    } else {
        res.sendStatus(401); // Unauthorized if no token provided
    }
};

module.exports = verifyToken;
