const { auth } = require('../firebase/firebaseAdmin');

const registerUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        const user = await auth.createUser({
            email,
            password
        });
        
        res.status(201).json({ 
            message: 'User registered successfully', 
            uid: user.uid 
        });
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            res.status(400);
            error.message = 'The email address is already in use by another account.';
        }
        next(error);
    }
};

const loginUser = (req, res) => {
    res.status(200).json({ 
        token: 'ID_TOKEN_FROM_CLIENT',
        message: 'Login successful (Client must provide ID Token for subsequent requests)'
    });
};

const logoutUser = (req, res) => {
    res.status(200).json({ 
        message: 'Logout successful (Token discarded on client side)' 
    });
};

module.exports = { 
    registerUser, 
    loginUser, 
    logoutUser 
};
