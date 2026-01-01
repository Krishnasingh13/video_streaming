// routes/auth.routes.js
const express = require('express');
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', auth, authController.me);

router.get('/protected', auth, (req, res) => {
    res.json({ message: 'OK', user: req.user });
});

module.exports = router;
