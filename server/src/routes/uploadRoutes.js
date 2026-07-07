import express from 'express';
import {
  deletePortfolioAsset,
  updatePortfolioMetadata,
  uploadPortfolioAsset
} from '../controllers/uploadController.js';
import protect from '../middleware/auth.js';
import { portfolioUpload } from '../middleware/upload.js';

const router = express.Router();

router.post('/', protect, portfolioUpload, uploadPortfolioAsset);
router.delete('/', protect, deletePortfolioAsset);
router.put('/metadata', protect, portfolioUpload, updatePortfolioMetadata);
router.delete('/:publicId(*)', protect, deletePortfolioAsset);
router.put('/:publicId(*)/metadata', protect, portfolioUpload, updatePortfolioMetadata);

export default router;
