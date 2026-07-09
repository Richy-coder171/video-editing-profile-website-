import { getSupabaseClient } from '../config/supabase.js';
import { getTypeConfig } from '../config/portfolioTypes.js';
import asyncHandler from '../utils/asyncHandler.js';
import { cloudinaryDeliveryUrl, deleteFromCloudinary, uploadBufferToCloudinary } from '../utils/cloudinaryUpload.js';
import { getFileKind } from '../middleware/upload.js';
import {
  normalizePortfolioRow,
  normalizeTools,
  parseFeatured,
  parseSortOrder,
  validatePortfolioPayload
} from '../utils/portfolioRows.js';

const bytesFromMb = (value, fallback) => Number(value || fallback) * 1024 * 1024;

const assertFileSize = (file, kind) => {
  if (!file) {
    return;
  }

  const maxBytes =
    kind === 'video'
      ? bytesFromMb(process.env.MAX_VIDEO_SIZE_MB, 500)
      : bytesFromMb(process.env.MAX_IMAGE_SIZE_MB, 25);

  if (file.size > maxBytes) {
    const maxMb = kind === 'video' ? process.env.MAX_VIDEO_SIZE_MB || 500 : process.env.MAX_IMAGE_SIZE_MB || 25;
    const error = new Error(`${kind === 'video' ? 'Video' : 'Image'} uploads must be ${maxMb}MB or smaller`);
    error.statusCode = 400;
    throw error;
  }
};

const getUploadFiles = (req) => ({
  file: req.files?.file?.[0],
  thumbnail: req.files?.thumbnail?.[0]
});

const throwSupabaseError = (error) => {
  const tableMissing =
    error?.code === 'PGRST205' ||
    error?.message?.includes("Could not find the table 'public.portfolio_items'");
  const requestError = new Error(
    tableMissing
      ? 'Supabase table public.portfolio_items was not found. Run supabase/schema.sql in the Supabase SQL Editor, then try uploading again.'
      : error?.message || 'Unable to save portfolio metadata'
  );
  requestError.statusCode = error?.code === '23505' ? 409 : 500;
  throw requestError;
};

const cleanupCloudinaryAssets = async ({ mediaPublicId, resourceType, thumbnailPublicId }) => {
  const cleanupTasks = [];

  if (mediaPublicId) {
    cleanupTasks.push(deleteFromCloudinary(mediaPublicId, resourceType).catch(() => undefined));
  }

  if (thumbnailPublicId) {
    cleanupTasks.push(deleteFromCloudinary(thumbnailPublicId, 'image').catch(() => undefined));
  }

  await Promise.all(cleanupTasks);
};

const uploadAssociatedThumbnail = async (thumbnail) => {
  if (!thumbnail) {
    return { thumbnailUrl: '', thumbnailPublicId: '' };
  }

  const result = await uploadBufferToCloudinary(thumbnail.buffer, {
    folder: 'portfolio/thumbnails',
    resource_type: 'image'
  });

  return {
    thumbnailPublicId: result.public_id,
    thumbnailUrl:
      result.secure_url ||
      cloudinaryDeliveryUrl(result.public_id, {
        resource_type: 'image',
        quality: 'auto',
        fetch_format: 'auto'
      })
  };
};

const getGeneratedThumbnailUrl = (publicId, resourceType, mediaUrl) => {
  if (resourceType !== 'video') {
    return mediaUrl;
  }

  return cloudinaryDeliveryUrl(publicId, {
    resource_type: 'video',
    format: 'jpg',
    transformation: [{ start_offset: 'auto', quality: 'auto' }]
  });
};

const uploadPortfolioAsset = asyncHandler(async (req, res) => {
  const { file, thumbnail } = getUploadFiles(req);

  if (!file) {
    res.status(400);
    throw new Error('Portfolio file is required in the file field');
  }

  const { title, description, type, category, tools, featured, sort_order: sortOrder } = req.body;
  const errors = validatePortfolioPayload({ title, type });

  if (errors.length) {
    res.status(400);
    throw new Error(errors.join(', '));
  }

  const config = getTypeConfig(type);
  const fileKind = getFileKind(file);

  if (config.resourceType === 'video' && fileKind !== 'video') {
    res.status(400);
    throw new Error(`${config.label} uploads must be video files`);
  }

  if (config.resourceType === 'image' && fileKind !== 'image') {
    res.status(400);
    throw new Error(`${config.label} uploads must be image files`);
  }

  assertFileSize(file, config.resourceType);
  assertFileSize(thumbnail, 'image');

  const supabase = getSupabaseClient();
  let mediaResult;
  let thumbnailResult = { thumbnailUrl: '', thumbnailPublicId: '' };

  try {
    const uploadOptions = {
      folder: config.folder,
      resource_type: config.resourceType
    };

    if (config.resourceType === 'video') {
      uploadOptions.chunk_size = 6_000_000;
    }

    mediaResult = await uploadBufferToCloudinary(file.buffer, uploadOptions);

    thumbnailResult = await uploadAssociatedThumbnail(thumbnail);
  } catch (error) {
    await cleanupCloudinaryAssets({
      mediaPublicId: mediaResult?.public_id,
      resourceType: config.resourceType,
      thumbnailPublicId: thumbnailResult.thumbnailPublicId
    });
    throw error;
  }

  const mediaUrl =
    mediaResult.secure_url ||
    cloudinaryDeliveryUrl(mediaResult.public_id, {
      resource_type: config.resourceType,
      quality: 'auto',
      fetch_format: 'auto'
    });
  const thumbnailUrl =
    thumbnailResult.thumbnailUrl || getGeneratedThumbnailUrl(mediaResult.public_id, config.resourceType, mediaUrl);
  const timestamp = new Date().toISOString();

  const insertPayload = {
    title: String(title || '').trim(),
    description: String(description || '').trim(),
    type,
    category: String(category || '').trim(),
    tools: normalizeTools(tools),
    media_url: mediaUrl,
    thumbnail_url: thumbnailUrl,
    cloudinary_public_id: mediaResult.public_id,
    thumbnail_public_id: thumbnailResult.thumbnailPublicId,
    resource_type: config.resourceType,
    featured: parseFeatured(featured),
    sort_order: parseSortOrder(sortOrder),
    created_at: timestamp,
    updated_at: timestamp
  };

  const { data, error } = await supabase.from('portfolio_items').insert(insertPayload).select('*').single();

  if (error) {
    await cleanupCloudinaryAssets({
      mediaPublicId: mediaResult.public_id,
      resourceType: config.resourceType,
      thumbnailPublicId: thumbnailResult.thumbnailPublicId
    });
    throwSupabaseError(error);
  }

  const item = normalizePortfolioRow(data);
  res.status(201).json({ item, ...item });
});

export { uploadPortfolioAsset };
