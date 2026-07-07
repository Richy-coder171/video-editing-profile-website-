import streamifier from 'streamifier';
import cloudinary from '../config/cloudinary.js';

const ensureCloudinaryConfigured = () => {
  const requiredValues = [
    process.env.CLOUDINARY_CLOUD_NAME,
    process.env.CLOUDINARY_API_KEY,
    process.env.CLOUDINARY_API_SECRET
  ];

  if (requiredValues.some((value) => !value)) {
    const error = new Error('Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.');
    error.statusCode = 503;
    throw error;
  }
};

const uploadBufferToCloudinary = (buffer, options) =>
  new Promise((resolve, reject) => {
    ensureCloudinaryConfigured();

    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result);
    });

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });

const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  if (!publicId) {
    return null;
  }

  ensureCloudinaryConfigured();

  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
    invalidate: true
  });
};

const cloudinaryDeliveryUrl = (publicId, options = {}) => {
  ensureCloudinaryConfigured();
  return cloudinary.url(publicId, { secure: true, ...options });
};

export { uploadBufferToCloudinary, deleteFromCloudinary, cloudinaryDeliveryUrl };
