const { auth } = require('../firebase/firebaseAdmin');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decodedToken = await auth.verifyIdToken(token);
            req.userId = decodedToken.uid;

            next();
        } catch (error) {
            console.error('Firebase Auth Error:', error.message);
            res.status(401).json({ message: 'Not authorized, token failed or expired' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = protect;
