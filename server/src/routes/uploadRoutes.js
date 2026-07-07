import express from 'express';
import { uploadImage as uploadImageController, uploadVideo as uploadVideoController } from '../controllers/uploadController.js';
import protect from '../middleware/auth.js';
import { uploadImage, uploadVideo } from '../middleware/upload.js';

const router = express.Router();

router.post('/image', protect, uploadImage, uploadImageController);
router.post('/video', protect, uploadVideo, uploadVideoController);

export default router;
