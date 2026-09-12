import { API_BASE_URL } from '../config/apiConfig';

const CLOUD_NAME = 'deq0hxr3t';

/**
 * Automatically resize & optimize large images before uploading to prevent network timeouts and 502 Bad Gateway.
 * Keeps visual quality crisp (up to 2048x2048px at 90% quality).
 * @param {File} file
 * @param {number} maxDimension
 * @param {number} quality
 * @returns {Promise<File>}
 */
export const compressImage = async (file, maxDimension = 2048, quality = 0.9) => {
    if (!file || !file.type || !file.type.startsWith('image/') || file.type === 'image/gif' || file.type === 'image/svg+xml') {
        return file;
    }

    // If file is already smaller than 600KB, skip resizing
    if (file.size < 600 * 1024) {
        return file;
    }

    return new Promise((resolve) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);
            let { width, height } = img;

            // If image is already within maxDimension, skip resize
            if (width <= maxDimension && height <= maxDimension && file.size < 1.5 * 1024 * 1024) {
                return resolve(file);
            }

            if (width > height) {
                if (width > maxDimension) {
                    height = Math.round((height * maxDimension) / width);
                    width = maxDimension;
                }
            } else {
                if (height > maxDimension) {
                    width = Math.round((width * maxDimension) / height);
                    height = maxDimension;
                }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);

            const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
            canvas.toBlob(
                (blob) => {
                    if (!blob || blob.size >= file.size) {
                        return resolve(file);
                    }
                    const optimizedFile = new File([blob], file.name, {
                        type: mimeType,
                        lastModified: Date.now(),
                    });
                    resolve(optimizedFile);
                },
                mimeType,
                quality
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            resolve(file);
        };

        img.src = url;
    });
};

/**
 * Upload a single image to Cloudinary via the backend route.
 * Stores at highest fidelity. Returns the secure_url and public_id.
 * @param {File} file
 * @param {string} folder - Cloudinary folder ('loupe-jewels/products' by default)
 * @returns {Promise<{secure_url, optimized_url, public_id}>}
 */
export const uploadImageViaBackend = async (file, folder = 'loupe-jewels/products') => {
    const jwt = localStorage.getItem('jwt');
    const optimizedFile = await compressImage(file);
    const formData = new FormData();
    formData.append('file', optimizedFile);
    formData.append('folder', folder);

    const res = await fetch(`${API_BASE_URL}/api/upload/image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${jwt}` },
        body: formData,
    });

    if (!res.ok) {
        let errMsg = 'Image upload failed';
        try {
            const err = await res.json();
            errMsg = err.error || errMsg;
        } catch (e) {}
        throw new Error(errMsg);
    }

    return res.json(); // { secure_url, optimized_url, public_id, width, height, bytes }
};

/**
 * Upload multiple images (up to 4) via backend route.
 * @param {File[]} files
 * @param {string} folder
 * @returns {Promise<Array<{secure_url, optimized_url, public_id}>>}
 */
export const uploadMultipleImagesViaBackend = async (files, folder = 'loupe-jewels/products') => {
    const jwt = localStorage.getItem('jwt');
    const optimizedFiles = await Promise.all(files.map((f) => compressImage(f)));

    const formData = new FormData();
    optimizedFiles.forEach((f) => formData.append('files', f));
    formData.append('folder', folder);

    try {
        const res = await fetch(`${API_BASE_URL}/api/upload/images`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${jwt}` },
            body: formData,
        });

        if (res.ok) {
            const data = await res.json();
            return data.results;
        }

        console.warn('Batch image upload failed, attempting sequential single uploads...');
    } catch (batchErr) {
        console.warn('Batch upload network error, falling back to sequential single uploads:', batchErr);
    }

    // Fallback: upload each image individually to ensure reliable delivery
    const results = [];
    for (const file of optimizedFiles) {
        const singleResult = await uploadImageViaBackend(file, folder);
        results.push(singleResult);
    }
    return results;
};

/**
 * Upload a video to Cloudinary via the backend route.
 * Stored with q_auto:best,vc_auto for best quality streaming.
 * @param {File} file
 * @param {string} folder
 * @param {function} onProgress - optional callback(percent) (not available with fetch, use XMLHttpRequest)
 * @returns {Promise<{secure_url, optimized_url, public_id, duration}>}
 */
export const uploadVideoViaBackend = async (file, folder = 'loupe-jewels/videos', onProgress = null) => {
    const jwt = localStorage.getItem('jwt');

    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const xhr = new XMLHttpRequest();

        if (onProgress) {
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    onProgress(Math.round((e.loaded / e.total) * 100));
                }
            });
        }

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                try {
                    const err = JSON.parse(xhr.responseText);
                    reject(new Error(err.error || 'Video upload failed'));
                } catch {
                    reject(new Error('Video upload failed'));
                }
            }
        };

        xhr.onerror = () => reject(new Error('Network error during video upload'));

        xhr.open('POST', `${API_BASE_URL}/api/upload/video`);
        xhr.setRequestHeader('Authorization', `Bearer ${jwt}`);
        xhr.send(formData);
    });
};

/**
 * Delete an asset from Cloudinary via the backend route.
 * @param {string} publicId  - Cloudinary public_id
 * @param {string} type      - 'image' or 'video'
 */
export const deleteAssetViaBackend = async (publicId, type = 'image') => {
    const jwt = localStorage.getItem('jwt');
    const encodedId = encodeURIComponent(publicId);

    const res = await fetch(`${API_BASE_URL}/api/upload/${encodedId}?type=${type}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${jwt}` },
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to delete asset');
    }

    return res.json();
};

/**
 * Transform any Cloudinary URL to add q_auto:best,f_auto for optimal delivery.
 * Images: q_auto:best,f_auto (smart quality + best format for browser)
 * Videos: q_auto:best,vc_auto (smart quality + best codec)
 * @param {string} url
 * @param {string} type - 'image' | 'video'
 * @returns {string}
 */
export const getOptimizedCloudinaryUrl = (url, type = 'image') => {
    if (!url || !url.includes('cloudinary.com')) return url;
    const params = type === 'image' ? 'q_auto:best,f_auto' : 'q_auto:best,vc_auto';
    return url.replace('/upload/', `/upload/${params}/`);
};

/**
 * Check if a URL is a Cloudinary URL
 */
export const isCloudinaryUrl = (url) => {
    return url && url.includes(`res.cloudinary.com/${CLOUD_NAME}`);
};
