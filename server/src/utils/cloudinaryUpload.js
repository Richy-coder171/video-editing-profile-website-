import streamifier from 'streamifier';
import cloudinary from '../config/cloudinary.js';
import { typeTag } from '../config/portfolioTypes.js';

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

const getContext = (resource = {}) => resource.context?.custom || resource.context || {};

const parseTools = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return String(value)
      .split(',')
      .map((tool) => tool.trim())
      .filter(Boolean);
  }
};

const parseBoolean = (value) => value === true || value === 'true';

const normalizeCloudinaryAsset = (resource) => {
  const context = getContext(resource);
  const tags = resource.tags || [];
  const typeFromTag = tags.find((tag) => tag.startsWith('type_'))?.replace('type_', '');
  const type = context.type || typeFromTag || 'portfolio';
  const resourceType = resource.resource_type || (type === 'reel' || type === 'video' ? 'video' : 'image');
  const mediaUrl = cloudinaryDeliveryUrl(resource.public_id, {
    resource_type: resourceType,
    quality: 'auto',
    fetch_format: 'auto'
  });
  const generatedVideoThumbnail =
    resourceType === 'video'
      ? cloudinaryDeliveryUrl(resource.public_id, {
          resource_type: 'video',
          format: 'jpg',
          transformation: [{ start_offset: 'auto', quality: 'auto' }]
        })
      : '';

  return {
    id: resource.public_id,
    _id: resource.public_id,
    publicId: resource.public_id,
    cloudinaryPublicId: resource.public_id,
    resourceType,
    title: context.title || resource.public_id.split('/').pop(),
    description: context.description || '',
    type,
    category: context.category || '',
    tools: parseTools(context.tools),
    featured: parseBoolean(context.featured),
    mediaUrl,
    thumbnailUrl: context.thumbnailUrl || generatedVideoThumbnail || mediaUrl,
    thumbnailPublicId: context.thumbnailPublicId || '',
    width: resource.width,
    height: resource.height,
    format: resource.format,
    bytes: resource.bytes,
    duration: resource.duration,
    createdAt: resource.created_at,
    tags
  };
};

const searchPortfolioAssets = async ({ type, featured, limit = 60 } = {}) => {
  ensureCloudinaryConfigured();

  const expressionParts = ['tags=portfolio'];

  if (type) {
    expressionParts.push(`tags=${typeTag(type)}`);
  }

  if (featured) {
    expressionParts.push('tags=featured');
  }

  const result = await cloudinary.search
    .expression(expressionParts.join(' AND '))
    .with_field('context')
    .with_field('tags')
    .sort_by('created_at', 'desc')
    .max_results(Math.min(Number(limit) || 60, 100))
    .execute();

  return (result.resources || []).map(normalizeCloudinaryAsset);
};

const updateCloudinaryMetadata = async (publicId, { resourceType = 'image', context, tags }) => {
  ensureCloudinaryConfigured();

  const result = await cloudinary.uploader.explicit(publicId, {
    type: 'upload',
    resource_type: resourceType,
    context,
    tags
  });

  return normalizeCloudinaryAsset(result);
};

export {
  uploadBufferToCloudinary,
  deleteFromCloudinary,
  cloudinaryDeliveryUrl,
  normalizeCloudinaryAsset,
  searchPortfolioAssets,
  updateCloudinaryMetadata
};
