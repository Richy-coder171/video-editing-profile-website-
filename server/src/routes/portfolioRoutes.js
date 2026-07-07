import express from 'express';
import {
  deletePortfolioItem,
  getFeaturedItems,
  getItemsByType,
  getPortfolioItems,
  updatePortfolioItem
} from '../controllers/portfolioController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPortfolioItems);
router.get('/featured', getFeaturedItems);
router.get('/type/:type', getItemsByType);
router.put('/:id', protect, updatePortfolioItem);
router.delete('/:id', protect, deletePortfolioItem);

export default router;
