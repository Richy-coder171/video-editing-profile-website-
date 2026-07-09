import streamifier from 'streamifier';
import cloudinary, { configureCloudinary } from '../config/cloudinary.js';

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

  configureCloudinary();
};

const normalizeCloudinaryError = (error) => {
  if (error?.message?.includes('Invalid cloud_name')) {
    const cloudinaryError = new Error(
      'Invalid CLOUDINARY_CLOUD_NAME. Use the Cloud name from Cloudinary Dashboard > Product Environment Credentials, not your username.'
    );
    cloudinaryError.statusCode = 400;
    return cloudinaryError;
  }

  if (error?.message?.includes('Must supply api_key')) {
    const cloudinaryError = new Error(
      'Cloudinary API key is missing. Check CLOUDINARY_API_KEY in server/.env and restart the backend.'
    );
    cloudinaryError.statusCode = 400;
    return cloudinaryError;
  }

  return error;
};

const uploadBufferToCloudinary = (buffer, options) =>
  new Promise((resolve, reject) => {
    ensureCloudinaryConfigured();

    const uploadMethod = options?.resource_type === 'video' ? 'upload_large_stream' : 'upload_stream';
    const uploadStream = cloudinary.uploader[uploadMethod](options, (error, result) => {
      if (error) {
        reject(normalizeCloudinaryError(error));
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

  try {
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true
    });
  } catch (error) {
    throw normalizeCloudinaryError(error);
  }
};

const cloudinaryDeliveryUrl = (publicId, options = {}) => {
  ensureCloudinaryConfigured();
  return cloudinary.url(publicId, { secure: true, ...options });
};

export { uploadBufferToCloudinary, deleteFromCloudinary, cloudinaryDeliveryUrl };
