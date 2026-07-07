import express from 'express';
import { uploadPortfolioAsset } from '../controllers/uploadController.js';
import protect from '../middleware/auth.js';
import { portfolioUpload } from '../middleware/upload.js';

const router = express.Router();

router.post('/', protect, portfolioUpload, uploadPortfolioAsset);

export default router;
