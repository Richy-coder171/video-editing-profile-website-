import express from 'express';
import {
  getFeaturedItems,
  getItemsByType,
  getPortfolioItems
} from '../controllers/portfolioController.js';

const router = express.Router();

router.get('/', getPortfolioItems);
router.get('/featured', getFeaturedItems);
router.get('/type/:type', getItemsByType);

export default router;
