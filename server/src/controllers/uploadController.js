import { getTypeConfig, PORTFOLIO_TYPES, typeTag } from '../config/portfolioTypes.js';
import asyncHandler from '../utils/asyncHandler.js';
import {
  cloudinaryDeliveryUrl,
  deleteFromCloudinary,
  normalizeCloudinaryAsset,
  updateCloudinaryMetadata,
  uploadBufferToCloudinary
} from '../utils/cloudinaryUpload.js';

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

const normalizeTools = (tools) => {
  if (Array.isArray(tools)) {
    return tools.map((tool) => String(tool).trim()).filter(Boolean);
  }

  return String(tools || '')
    .split(',')
    .map((tool) => tool.trim())
    .filter(Boolean);
};

const parseFeatured = (value) => value === true || value === 'true';

const bytesFromMb = (value, fallback) => Number(value || fallback) * 1024 * 1024;

const assertFileSize = (file, kind) => {
  if (!file) {
    return;
  }

  const maxBytes =
    kind === 'video'
      ? bytesFromMb(process.env.MAX_VIDEO_SIZE_MB, 80)
      : bytesFromMb(process.env.MAX_IMAGE_SIZE_MB, 8);

  if (file.size > maxBytes) {
    const maxMb = kind === 'video' ? process.env.MAX_VIDEO_SIZE_MB || 80 : process.env.MAX_IMAGE_SIZE_MB || 8;
    const error = new Error(`${kind === 'video' ? 'Video' : 'Image'} uploads must be ${maxMb}MB or smaller`);
    error.statusCode = 400;
    throw error;
  }
};

const getUploadFiles = (req) => ({
  file: req.files?.file?.[0],
  thumbnail: req.files?.thumbnail?.[0]
});

const safeDecodeURIComponent = (value) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const getPublicIdFromRequest = (req) => {
  const rawPublicId = req.body?.publicId || req.params.publicId;

  if (!rawPublicId) {
    const error = new Error('publicId is required');
    error.statusCode = 400;
    throw error;
  }

  return safeDecodeURIComponent(rawPublicId);
};

const buildContext = ({ title, description, type, category, tools, featured, thumbnailUrl, thumbnailPublicId }) => ({
  title: String(title || '').trim(),
  description: String(description || '').trim(),
  type,
  category: String(category || '').trim(),
  tools: JSON.stringify(normalizeTools(tools)),
  featured: String(parseFeatured(featured)),
  thumbnailUrl: thumbnailUrl || '',
  thumbnailPublicId: thumbnailPublicId || ''
});

const buildTags = ({ type, category, featured }) =>
  [
    'portfolio',
    typeTag(type),
    parseFeatured(featured) ? 'featured' : '',
    category ? `category_${slugify(category)}` : ''
  ].filter(Boolean);

const validatePayload = ({ title, type }) => {
  const errors = [];

  if (!title?.trim()) {
    errors.push('title is required');
  }

  if (!PORTFOLIO_TYPES.includes(type)) {
    errors.push(`type must be one of: ${PORTFOLIO_TYPES.join(', ')}`);
  }

  return errors;
};

const uploadAssociatedThumbnail = async (thumbnail, title) => {
  if (!thumbnail) {
    return { thumbnailUrl: '', thumbnailPublicId: '' };
  }

  const result = await uploadBufferToCloudinary(thumbnail.buffer, {
    folder: 'portfolio/thumbnails',
    resource_type: 'image',
    tags: ['portfolio_asset_thumbnail'],
    context: {
      title: `${title || 'Portfolio'} thumbnail`,
      role: 'thumbnail'
    }
  });

  return {
    thumbnailPublicId: result.public_id,
    thumbnailUrl: cloudinaryDeliveryUrl(result.public_id, {
      resource_type: 'image',
      quality: 'auto',
      fetch_format: 'auto'
    })
  };
};

const uploadPortfolioAsset = asyncHandler(async (req, res) => {
  const { file, thumbnail } = getUploadFiles(req);

  if (!file) {
    res.status(400);
    throw new Error('Portfolio file is required in the file field');
  }

  const { title, description, type, category, tools, featured } = req.body;
  const errors = validatePayload({ title, type });

  if (errors.length) {
    res.status(400);
    throw new Error(errors.join(', '));
  }

  const config = getTypeConfig(type);
  const isVideoFile = file.mimetype.startsWith('video/');

  if (config.resourceType === 'video' && !isVideoFile) {
    res.status(400);
    throw new Error(`${config.label} uploads must be video files`);
  }

  if (config.resourceType === 'image' && isVideoFile) {
    res.status(400);
    throw new Error(`${config.label} uploads must be image files`);
  }

  assertFileSize(file, config.resourceType);
  assertFileSize(thumbnail, 'image');

  const thumbnailResult = await uploadAssociatedThumbnail(thumbnail, title);
  const context = buildContext({
    title,
    description,
    type,
    category,
    tools,
    featured,
    ...thumbnailResult
  });
  const tags = buildTags({ type, category, featured });

  const uploadOptions = {
    folder: config.folder,
    resource_type: config.resourceType,
    tags,
    context
  };

  if (config.resourceType === 'video') {
    uploadOptions.chunk_size = 6_000_000;
    uploadOptions.eager = [{ quality: 'auto', format: 'mp4' }];
    uploadOptions.eager_async = false;
  }

  let result;

  try {
    result = await uploadBufferToCloudinary(file.buffer, uploadOptions);
  } catch (error) {
    if (thumbnailResult.thumbnailPublicId) {
      await deleteFromCloudinary(thumbnailResult.thumbnailPublicId, 'image').catch(() => undefined);
    }

    throw error;
  }

  const item = normalizeCloudinaryAsset({
    ...result,
    resource_type: config.resourceType,
    context: { custom: context },
    tags
  });

  res.status(201).json({ item, ...item });
});

const deletePortfolioAsset = asyncHandler(async (req, res) => {
  const publicId = getPublicIdFromRequest(req);
  const resourceType = req.body?.resourceType || req.query.resourceType || 'image';
  const thumbnailPublicId = req.body?.thumbnailPublicId || req.query.thumbnailPublicId;

  await deleteFromCloudinary(publicId, resourceType);

  if (thumbnailPublicId) {
    await deleteFromCloudinary(safeDecodeURIComponent(thumbnailPublicId), 'image');
  }

  res.json({ message: 'Cloudinary asset deleted' });
});

const updatePortfolioMetadata = asyncHandler(async (req, res) => {
  const publicId = getPublicIdFromRequest(req);
  const { thumbnail } = getUploadFiles(req);
  const {
    title,
    description,
    type,
    category,
    tools,
    featured,
    thumbnailUrl,
    thumbnailPublicId,
    resourceType
  } = req.body;
  const errors = validatePayload({ title, type });

  if (errors.length) {
    res.status(400);
    throw new Error(errors.join(', '));
  }

  assertFileSize(thumbnail, 'image');
  const uploadedThumbnail = await uploadAssociatedThumbnail(thumbnail, title);
  const nextThumbnailUrl = uploadedThumbnail.thumbnailUrl || thumbnailUrl;
  const nextThumbnailPublicId = uploadedThumbnail.thumbnailPublicId || thumbnailPublicId;

  const context = buildContext({
    title,
    description,
    type,
    category,
    tools,
    featured,
    thumbnailUrl: nextThumbnailUrl,
    thumbnailPublicId: nextThumbnailPublicId
  });
  const tags = buildTags({ type, category, featured });
  let item;

  try {
    item = await updateCloudinaryMetadata(publicId, {
      resourceType: resourceType || (type === 'reel' || type === 'video' ? 'video' : 'image'),
      context,
      tags
    });
  } catch (error) {
    if (uploadedThumbnail.thumbnailPublicId) {
      await deleteFromCloudinary(uploadedThumbnail.thumbnailPublicId, 'image').catch(() => undefined);
    }

    throw error;
  }

  if (
    uploadedThumbnail.thumbnailPublicId &&
    thumbnailPublicId &&
    uploadedThumbnail.thumbnailPublicId !== thumbnailPublicId
  ) {
    await deleteFromCloudinary(thumbnailPublicId, 'image');
  }

  res.json({ item });
});

export { uploadPortfolioAsset, deletePortfolioAsset, updatePortfolioMetadata };
