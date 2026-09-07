const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate.js');
const {
    getSparkleVideos,
    getAllSparkleVideosAdmin,
    createSparkleVideo,
    updateSparkleVideo,
    deleteSparkleVideo,
    toggleSparkleVideoStatus,
} = require('../controller/sparkleVideo.controller.js');

// Public — homepage fetches active videos
router.get('/', getSparkleVideos);

// Admin routes (protected)
router.get('/admin', authenticate, getAllSparkleVideosAdmin);
router.post('/', authenticate, createSparkleVideo);
router.put('/:id', authenticate, updateSparkleVideo);
router.delete('/:id', authenticate, deleteSparkleVideo);
router.patch('/:id/toggle', authenticate, toggleSparkleVideoStatus);

module.exports = router;
