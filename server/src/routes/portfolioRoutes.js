import express from 'express';
import {
  createPortfolioItem,
  deletePortfolioItem,
  getFeaturedItems,
  getItemsByType,
  getPortfolioItem,
  getPortfolioItems,
  updatePortfolioItem
} from '../controllers/portfolioController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPortfolioItems);
router.get('/featured', getFeaturedItems);
router.get('/type/:type', getItemsByType);
router.get('/:id', getPortfolioItem);
router.post('/', protect, createPortfolioItem);
router.put('/:id', protect, updatePortfolioItem);
router.delete('/:id', protect, deletePortfolioItem);

export default router;
