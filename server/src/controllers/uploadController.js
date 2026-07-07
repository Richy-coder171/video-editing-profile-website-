import asyncHandler from '../utils/asyncHandler.js';
import { cloudinaryDeliveryUrl, uploadBufferToCloudinary } from '../utils/cloudinaryUpload.js';

const folder = process.env.CLOUDINARY_FOLDER || 'cinematic-portfolio';

const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Image file is required in the file field');
  }

  const result = await uploadBufferToCloudinary(req.file.buffer, {
    folder: `${folder}/images`,
    resource_type: 'image'
  });

  const optimizedUrl = cloudinaryDeliveryUrl(result.public_id, {
    resource_type: 'image',
    quality: 'auto',
    fetch_format: 'auto'
  });

  res.status(201).json({
    url: optimizedUrl,
    mediaUrl: optimizedUrl,
    publicId: result.public_id,
    cloudinaryPublicId: result.public_id,
    resourceType: result.resource_type,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes
  });
});

const uploadVideo = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Video file is required in the file field');
  }

  const result = await uploadBufferToCloudinary(req.file.buffer, {
    folder: `${folder}/videos`,
    resource_type: 'video',
    chunk_size: 6_000_000,
    eager: [{ quality: 'auto', format: 'mp4' }],
    eager_async: false
  });

  const optimizedUrl = cloudinaryDeliveryUrl(result.public_id, {
    resource_type: 'video',
    quality: 'auto',
    fetch_format: 'auto'
  });
  const thumbnailUrl = cloudinaryDeliveryUrl(result.public_id, {
    resource_type: 'video',
    format: 'jpg',
    transformation: [{ start_offset: 'auto', quality: 'auto' }]
  });

  res.status(201).json({
    url: optimizedUrl,
    mediaUrl: optimizedUrl,
    thumbnailUrl,
    publicId: result.public_id,
    cloudinaryPublicId: result.public_id,
    resourceType: result.resource_type,
    width: result.width,
    height: result.height,
    duration: result.duration,
    format: result.format,
    bytes: result.bytes
  });
});

export { uploadImage, uploadVideo };
