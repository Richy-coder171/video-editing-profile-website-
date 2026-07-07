import multer from 'multer';

const storage = multer.memoryStorage();

const bytesFromMb = (value, fallback) => Number(value || fallback) * 1024 * 1024;

const allowedMimeTypes = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  video: ['video/mp4', 'video/webm', 'video/quicktime']
};

const portfolioUpload = multer({
  storage,
  limits: {
    fileSize: bytesFromMb(process.env.MAX_VIDEO_SIZE_MB, 80),
    files: 2
  },
  fileFilter(_req, file, callback) {
    if (file.fieldname === 'thumbnail' && !allowedMimeTypes.image.includes(file.mimetype)) {
      callback(new Error('Invalid thumbnail file type'));
      return;
    }

    if (
      file.fieldname === 'file' &&
      ![...allowedMimeTypes.image, ...allowedMimeTypes.video].includes(file.mimetype)
    ) {
      callback(new Error('Invalid portfolio file type'));
      return;
    }

    callback(null, true);
  }
}).fields([
  { name: 'file', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]);

export { allowedMimeTypes, portfolioUpload };
