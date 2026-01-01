// controllers/authController.js
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { signToken } = require('../utils/jwt');

exports.register = async (req, res) => {
    try {
        const { email, password, name, role } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'email and password are required' });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            passwordHash,
            name,
            role: role || 'EDITOR'
        });

        const token = signToken(user);

        const userSafe = user.toObject();
        delete userSafe.passwordHash;

        return res.status(201).json({
            message: 'User registered successfully',
            user: userSafe,
            token,
        });
    } catch (err) {
        console.error('Register error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = signToken(user);

        const userSafe = user.toObject();
        delete userSafe.passwordHash;

        return res.json({
            message: 'Logged in successfully',
            user: userSafe,
            token,
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.me = async (req, res) => {
    try {
        const fullUser = await User.findById(req.user.id).select('-passwordHash');

        if (!fullUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json({ user: fullUser });
    } catch (err) {
        console.error('Me error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.logout = (req, res) => {
    return res.json({ message: 'Logged out — delete token client-side' });
};
