import multer from 'multer';
import { mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, extname, join } from 'node:path';

const uploadTempDir = join(tmpdir(), 'cinematic-portfolio-uploads');
mkdirSync(uploadTempDir, { recursive: true });

const storage = multer.diskStorage({
  destination(_req, _file, callback) {
    callback(null, uploadTempDir);
  },
  filename(_req, file, callback) {
    const extension = getExtension(file.originalname);
    const safeName = basename(file.originalname, extension)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60);

    callback(null, `${Date.now()}-${Math.random().toString(16).slice(2)}-${safeName || file.fieldname}${extension}`);
  }
});

const bytesFromMb = (value, fallback) => Number(value || fallback) * 1024 * 1024;

const allowedMimeTypes = {
  image: ['image/jpeg', 'image/pjpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/heic', 'image/heif'],
  video: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v', 'video/x-msvideo', 'video/x-matroska', 'video/mpeg']
};

const allowedExtensions = {
  image: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.heic', '.heif'],
  video: ['.mp4', '.mov', '.webm', '.m4v', '.avi', '.mkv', '.mpeg', '.mpg']
};

const getExtension = (filename = '') => extname(filename).toLowerCase();

const getFileKind = (file) => {
  if (!file) {
    return null;
  }

  if (allowedMimeTypes.image.includes(file.mimetype)) {
    return 'image';
  }

  if (allowedMimeTypes.video.includes(file.mimetype)) {
    return 'video';
  }

  const extension = getExtension(file.originalname);

  if (allowedExtensions.image.includes(extension)) {
    return 'image';
  }

  if (allowedExtensions.video.includes(extension)) {
    return 'video';
  }

  return null;
};

const portfolioUpload = multer({
  storage,
  limits: {
    fileSize: bytesFromMb(process.env.MAX_VIDEO_SIZE_MB, 100),
    files: 2
  },
  fileFilter(_req, file, callback) {
    const fileKind = getFileKind(file);

    if (file.fieldname === 'thumbnail' && fileKind !== 'image') {
      callback(new Error('Invalid thumbnail file type. Use JPG, PNG, WebP, GIF, AVIF, HEIC, or HEIF.'));
      return;
    }

    if (file.fieldname === 'file' && !fileKind) {
      callback(new Error('Invalid portfolio file type. Use JPG, PNG, WebP, GIF, AVIF, HEIC, MP4, MOV, WebM, M4V, AVI, or MKV.'));
      return;
    }

    callback(null, true);
  }
}).fields([
  { name: 'file', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]);

export { allowedExtensions, allowedMimeTypes, getFileKind, portfolioUpload, uploadTempDir };
