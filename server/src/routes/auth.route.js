const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller.js');

router.post('/signup', authController.register);
router.post('/login', authController.login);
router.post('/google-login', authController.googleLogin);

module.exports = router;