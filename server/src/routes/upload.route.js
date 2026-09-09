const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate.js');
const {
    imageUpload,
    videoUpload,
    uploadImage,
    uploadMultipleImages,
    uploadVideo,
    deleteAsset,
} = require('../controller/upload.controller.js');

// POST /api/upload/image  — single image (admin only)
router.post('/image', authenticate, imageUpload.single('file'), uploadImage);

// POST /api/upload/images — multiple images up to 4 (admin only)
router.post('/images', authenticate, imageUpload.array('files', 4), uploadMultipleImages);

// POST /api/upload/video  — single video (admin only)
router.post('/video', authenticate, videoUpload.single('file'), uploadVideo);

// DELETE /api/upload/:publicId?type=image|video (admin only)
router.delete('/:publicId', authenticate, deleteAsset);

module.exports = router;
