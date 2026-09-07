const multer = require('multer');
const { uploadToCloudinary, deleteFromCloudinary, getOptimizedUrl } = require('../config/cloudinary');

// Use memory storage so multer gives us a Buffer for Cloudinary streaming
const storage = multer.memoryStorage();

const imageUpload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB — matches Cloudinary free plan max
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];
        if (allowed.includes(file.mimetype)) cb(null, true);
        else cb(new Error('Only image files (JPG, PNG, WEBP) are allowed'));
    }
});

const videoUpload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB — matches Cloudinary free plan max
    fileFilter: (req, file, cb) => {
        const allowed = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo'];
        if (allowed.includes(file.mimetype)) cb(null, true);
        else cb(new Error('Only video files (MP4, WEBM, MOV, AVI) are allowed'));
    }
});

// ─── Image Upload Controller ────────────────────────────────────────────────
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const folder = req.body.folder || 'loupe-jewels/products';
        const result = await uploadToCloudinary(req.file.buffer, folder, 'image');

        // Return the optimized URL for display
        return res.status(200).json({
            success: true,
            secure_url: result.secure_url,
            optimized_url: getOptimizedUrl(result.secure_url, 'image'),
            public_id: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height,
            bytes: result.bytes,
        });
    } catch (error) {
        console.error('Image upload error:', error);
        return res.status(500).json({ error: error.message });
    }
};

// ─── Multiple Images Upload Controller ──────────────────────────────────────
const uploadMultipleImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No image files provided' });
        }

        const folder = req.body.folder || 'loupe-jewels/products';
        const uploads = await Promise.all(
            req.files.map(file => uploadToCloudinary(file.buffer, folder, 'image'))
        );

        const results = uploads.map(result => ({
            secure_url: result.secure_url,
            optimized_url: getOptimizedUrl(result.secure_url, 'image'),
            public_id: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height,
            bytes: result.bytes,
        }));

        return res.status(200).json({ success: true, count: results.length, results });
    } catch (error) {
        console.error('Multiple image upload error:', error);
        return res.status(500).json({ error: error.message });
    }
};

// ─── Video Upload Controller ─────────────────────────────────────────────────
const uploadVideo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No video file provided' });
        }

        const folder = req.body.folder || 'loupe-jewels/videos';
        const result = await uploadToCloudinary(req.file.buffer, folder, 'video');

        return res.status(200).json({
            success: true,
            secure_url: result.secure_url,
            optimized_url: getOptimizedUrl(result.secure_url, 'video'),
            public_id: result.public_id,
            format: result.format,
            bytes: result.bytes,
            duration: result.duration,
        });
    } catch (error) {
        console.error('Video upload error:', error);
        return res.status(500).json({ error: error.message });
    }
};

// ─── Delete Asset Controller ─────────────────────────────────────────────────
const deleteAsset = async (req, res) => {
    try {
        const { publicId } = req.params;
        const resourceType = req.query.type || 'image';

        if (!publicId) {
            return res.status(400).json({ error: 'public_id is required' });
        }

        const decodedId = decodeURIComponent(publicId);
        await deleteFromCloudinary(decodedId, resourceType);

        return res.status(200).json({ success: true, message: 'Asset deleted from Cloudinary' });
    } catch (error) {
        console.error('Delete asset error:', error);
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    imageUpload,
    videoUpload,
    uploadImage,
    uploadMultipleImages,
    uploadVideo,
    deleteAsset,
};
