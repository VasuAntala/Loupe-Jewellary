const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller.js');
const { route } = require('../index.js');

router.get('/profile', userController.getUserProfile);
router.put('/profile/:id', userController.updateUserProfile);
router.delete('/profile/:id', userController.deleteUserProfile);
router.get('/', userController.getAllUsers);

module.exports = router;