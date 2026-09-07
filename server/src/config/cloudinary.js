const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with credentials from .env
// Replace CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET with real values from:
// https://cloudinary.com/console -> Settings -> API Keys
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,  // Always use HTTPS URLs
});

/**
 * Upload an image buffer to Cloudinary at maximum quality (100).
 * Images are stored in the loupe-jewels/products folder.
 * @param {Buffer} fileBuffer - The file buffer from multer memoryStorage
 * @param {string} folder - Cloudinary folder path
 * @param {string} resourceType - 'image' or 'video'
 * @returns {Promise<{secure_url, public_id}>}
 */
const uploadToCloudinary = (fileBuffer, folder = 'loupe-jewels/products', resourceType = 'image') => {
    return new Promise((resolve, reject) => {
        const uploadOptions = {
            folder,
            resource_type: resourceType,
            // Store at quality:100 — maximum quality, no compression on upload
            quality: 100,
            // For videos: override with best quality encoding profile
            ...(resourceType === 'video' ? { quality: 'auto:best', video_codec: 'auto' } : {}),
        };

        const uploadStream = cloudinary.uploader.upload_stream(
            uploadOptions,
            (error, result) => {
                if (error) return reject(new Error(`Cloudinary upload failed: ${error.message}`));
                resolve({
                    secure_url: result.secure_url,
                    public_id: result.public_id,
                    format: result.format,
                    width: result.width,
                    height: result.height,
                    bytes: result.bytes,
                    duration: result.duration || null,   // for videos
                });
            }
        );

        uploadStream.end(fileBuffer);
    });
};

/**
 * Delete an asset from Cloudinary by its public_id.
 * @param {string} publicId - The public_id returned from upload
 * @param {string} resourceType - 'image' or 'video'
 */
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
    return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};

/**
 * Build an optimized delivery URL from a Cloudinary URL.
 * Appends q_auto:best,f_auto so browsers receive the best format and quality.
 * @param {string} url - The raw Cloudinary secure_url
 * @param {string} resourceType - 'image' or 'video'
 * @returns {string} Optimized URL
 */
const getOptimizedUrl = (url, resourceType = 'image') => {
    if (!url || !url.includes('cloudinary.com')) return url;
    // Insert transformation parameters before the version or filename segment
    const transformParams = resourceType === 'image'
        ? 'q_auto:best,f_auto'
        : 'q_auto:best,vc_auto';

    return url.replace('/upload/', `/upload/${transformParams}/`);
};

module.exports = { uploadToCloudinary, deleteFromCloudinary, getOptimizedUrl };
