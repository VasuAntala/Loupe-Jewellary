const SparkleVideo = require('../models/sparkleVideo.model.js');
const { deleteFromCloudinary, getOptimizedUrl } = require('../config/cloudinary.js');

// ─── GET all active sparkle videos ──────────────────────────────────────────
const getSparkleVideos = async (req, res) => {
    try {
        const videos = await SparkleVideo.find({ isActive: true })
            .sort({ displayOrder: 1, createdAt: -1 });

        // Return optimized URLs for frontend video delivery
        const result = videos.map(v => ({
            _id: v._id,
            title: v.title,
            price: v.price,
            minPrice: v.minPrice || 0,
            maxPrice: v.maxPrice || 0,
            oldPrice: v.oldPrice,
            discount: v.discount,
            videoUrl: getOptimizedUrl(v.videoUrl, 'video'),
            videoPublicId: v.videoPublicId,
            displayOrder: v.displayOrder,
            isActive: v.isActive,
            createdAt: v.createdAt,
        }));

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// ─── GET all sparkle videos (admin — includes inactive) ─────────────────────
const getAllSparkleVideosAdmin = async (req, res) => {
    try {
        const videos = await SparkleVideo.find().sort({ displayOrder: 1, createdAt: -1 });
        const result = videos.map(v => ({
            _id: v._id,
            title: v.title,
            price: v.price,
            minPrice: v.minPrice || 0,
            maxPrice: v.maxPrice || 0,
            oldPrice: v.oldPrice,
            discount: v.discount,
            videoUrl: getOptimizedUrl(v.videoUrl, 'video'),
            videoPublicId: v.videoPublicId,
            displayOrder: v.displayOrder,
            isActive: v.isActive,
            createdAt: v.createdAt,
        }));
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// ─── CREATE a new sparkle video entry (after video already uploaded) ─────────
const createSparkleVideo = async (req, res) => {
    try {
        const { title, price, minPrice, maxPrice, oldPrice, discount, videoUrl, videoPublicId, displayOrder } = req.body;

        if (!title || !videoUrl || !videoPublicId) {
            return res.status(400).json({ error: 'title, videoUrl, and videoPublicId are required' });
        }

        const numMin = Number(minPrice) || 0;
        const numMax = Number(maxPrice) || 0;

        if (!price && numMin <= 0 && numMax <= 0) {
            return res.status(400).json({ error: 'Please provide an approximate price range (Min and Max Price)' });
        }

        const video = new SparkleVideo({
            title,
            price: price || (numMin && numMax ? `${numMin} - ${numMax}` : ''),
            minPrice: numMin,
            maxPrice: numMax,
            oldPrice: oldPrice || '',
            discount: discount || '',
            videoUrl,
            videoPublicId,
            displayOrder: displayOrder || 0,
            isActive: true,
        });

        await video.save();
        return res.status(201).json({ success: true, video });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// ─── UPDATE sparkle video metadata ───────────────────────────────────────────
const updateSparkleVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };

        if (updates.minPrice !== undefined) updates.minPrice = Number(updates.minPrice) || 0;
        if (updates.maxPrice !== undefined) updates.maxPrice = Number(updates.maxPrice) || 0;

        const video = await SparkleVideo.findByIdAndUpdate(id, updates, { new: true });
        if (!video) return res.status(404).json({ error: 'Sparkle video not found' });

        return res.status(200).json({ success: true, video });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// ─── DELETE sparkle video (removes from DB + Cloudinary) ─────────────────────
const deleteSparkleVideo = async (req, res) => {
    try {
        const { id } = req.params;

        const video = await SparkleVideo.findById(id);
        if (!video) return res.status(404).json({ error: 'Sparkle video not found' });

        // Delete from Cloudinary first
        if (video.videoPublicId) {
            await deleteFromCloudinary(video.videoPublicId, 'video');
        }

        await SparkleVideo.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: 'Sparkle video deleted' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// ─── TOGGLE active status ─────────────────────────────────────────────────────
const toggleSparkleVideoStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const video = await SparkleVideo.findById(id);
        if (!video) return res.status(404).json({ error: 'Sparkle video not found' });

        video.isActive = !video.isActive;
        await video.save();
        return res.status(200).json({ success: true, isActive: video.isActive });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getSparkleVideos,
    getAllSparkleVideosAdmin,
    createSparkleVideo,
    updateSparkleVideo,
    deleteSparkleVideo,
    toggleSparkleVideoStatus,
};
