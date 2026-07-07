import multer from 'multer';

const storage = multer.memoryStorage();

const bytesFromMb = (value, fallback) => Number(value || fallback) * 1024 * 1024;

const allowedMimeTypes = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  video: ['video/mp4', 'video/webm', 'video/quicktime']
};

const createUploader = (kind) =>
  multer({
    storage,
    limits: {
      fileSize:
        kind === 'video'
          ? bytesFromMb(process.env.MAX_VIDEO_SIZE_MB, 80)
          : bytesFromMb(process.env.MAX_IMAGE_SIZE_MB, 8),
      files: 1
    },
    fileFilter(_req, file, callback) {
      if (!allowedMimeTypes[kind].includes(file.mimetype)) {
        callback(new Error(`Invalid ${kind} file type`));
        return;
      }

      callback(null, true);
    }
  });

const uploadImage = createUploader('image').single('file');
const uploadVideo = createUploader('video').single('file');

export { uploadImage, uploadVideo };
