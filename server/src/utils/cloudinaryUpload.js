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
  if (error?.message?.includes('File size too large')) {
    const cloudinaryError = new Error(
      'Cloudinary rejected this file because it is over your account upload limit. Your current limit appears to be 100MB. Compress the video below 100MB or upgrade/increase the Cloudinary upload limit.'
    );
    cloudinaryError.statusCode = 413;
    return cloudinaryError;
  }

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

const uploadFileToCloudinary = (filePath, options) =>
  new Promise((resolve, reject) => {
    ensureCloudinaryConfigured();

    const uploadMethod = options?.resource_type === 'video' ? 'upload_large' : 'upload';
    cloudinary.uploader[uploadMethod](filePath, options, (error, result) => {
      if (error) {
        reject(normalizeCloudinaryError(error));
        return;
      }

      resolve(result);
    });
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

export { uploadFileToCloudinary, deleteFromCloudinary, cloudinaryDeliveryUrl };
