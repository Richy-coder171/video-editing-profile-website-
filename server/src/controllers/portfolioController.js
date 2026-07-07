import { PORTFOLIO_TYPES } from '../config/portfolioTypes.js';
import asyncHandler from '../utils/asyncHandler.js';
import { searchPortfolioAssets } from '../utils/cloudinaryUpload.js';

const getPortfolioItems = asyncHandler(async (req, res) => {
  const { type, featured, limit = 60 } = req.query;

  if (type && !PORTFOLIO_TYPES.includes(type)) {
    res.status(400);
    throw new Error(`type must be one of: ${PORTFOLIO_TYPES.join(', ')}`);
  }

  const items = await searchPortfolioAssets({
    type,
    featured: featured === 'true',
    limit
  });

  res.json({ items, count: items.length });
});

const getFeaturedItems = asyncHandler(async (_req, res) => {
  const items = await searchPortfolioAssets({ featured: true, limit: 12 });
  res.json({ items, count: items.length });
});

const getItemsByType = asyncHandler(async (req, res) => {
  const { type } = req.params;

  if (!PORTFOLIO_TYPES.includes(type)) {
    res.status(400);
    throw new Error(`type must be one of: ${PORTFOLIO_TYPES.join(', ')}`);
  }

  const items = await searchPortfolioAssets({ type, limit: 100 });
  res.json({ items, count: items.length });
});

export { getPortfolioItems, getFeaturedItems, getItemsByType };
