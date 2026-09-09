const mongoose = require('mongoose');

/**
 * SparkleVideo — stores videos shown in the "Find Your Perfect Sparkle" 
 * section of the homepage. Videos are hosted on Cloudinary.
 */
const SparkleVideoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: String,
        required: true,
    },
    oldPrice: {
        type: String,
        default: '',
    },
    discount: {
        type: String,
        default: '',
    },
    // Cloudinary raw secure_url (quality: 100 stored original)
    videoUrl: {
        type: String,
        required: true,
    },
    // Cloudinary public_id — used for deletion
    videoPublicId: {
        type: String,
        required: true,
    },
    // Order for display in the carousel (lower = shown first)
    displayOrder: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const SparkleVideo = mongoose.model('sparkle_videos', SparkleVideoSchema);
module.exports = SparkleVideo;
