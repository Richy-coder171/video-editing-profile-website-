import PortfolioItem, { PORTFOLIO_TYPES } from '../models/PortfolioItem.js';
import asyncHandler from '../utils/asyncHandler.js';
import { deleteFromCloudinary } from '../utils/cloudinaryUpload.js';
import {
  normalizePortfolioPayload,
  validatePortfolioPayload
} from '../validators/portfolioValidation.js';

const getPortfolioItems = asyncHandler(async (req, res) => {
  const { type, category, featured, search, limit = 60 } = req.query;
  const query = {};

  if (type) {
    query.type = type;
  }

  if (category) {
    query.category = category;
  }

  if (featured !== undefined) {
    query.featured = featured === 'true';
  }

  if (search) {
    query.$text = { $search: search };
  }

  const safeLimit = Math.min(Number(limit) || 60, 120);
  const items = await PortfolioItem.find(query).sort({ featured: -1, createdAt: -1 }).limit(safeLimit);

  res.json({ items, count: items.length });
});

const getFeaturedItems = asyncHandler(async (_req, res) => {
  const items = await PortfolioItem.find({ featured: true }).sort({ createdAt: -1 }).limit(12);
  res.json({ items, count: items.length });
});

const getItemsByType = asyncHandler(async (req, res) => {
  const { type } = req.params;

  if (!PORTFOLIO_TYPES.includes(type)) {
    res.status(400);
    throw new Error(`type must be one of: ${PORTFOLIO_TYPES.join(', ')}`);
  }

  const items = await PortfolioItem.find({ type }).sort({ createdAt: -1 });
  res.json({ items, count: items.length });
});

const getPortfolioItem = asyncHandler(async (req, res) => {
  const item = await PortfolioItem.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error('Portfolio item not found');
  }

  res.json({ item });
});

const createPortfolioItem = asyncHandler(async (req, res) => {
  const payload = normalizePortfolioPayload(req.body);
  const errors = validatePortfolioPayload(payload);

  if (errors.length) {
    res.status(400);
    throw new Error(errors.join(', '));
  }

  const item = await PortfolioItem.create(payload);
  res.status(201).json({ item });
});

const updatePortfolioItem = asyncHandler(async (req, res) => {
  const item = await PortfolioItem.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error('Portfolio item not found');
  }

  const payload = normalizePortfolioPayload(req.body, true);
  const errors = validatePortfolioPayload(payload, true);

  if (errors.length) {
    res.status(400);
    throw new Error(errors.join(', '));
  }

  Object.entries(payload).forEach(([key, value]) => {
    item[key] = value;
  });

  const updatedItem = await item.save();
  res.json({ item: updatedItem });
});

const deletePortfolioItem = asyncHandler(async (req, res) => {
  const item = await PortfolioItem.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error('Portfolio item not found');
  }

  const resourceType = item.type === 'video' || item.type === 'reel' ? 'video' : 'image';
  await deleteFromCloudinary(item.cloudinaryPublicId, resourceType);
  await item.deleteOne();

  res.json({ message: 'Portfolio item deleted' });
});

export {
  getPortfolioItems,
  getFeaturedItems,
  getItemsByType,
  getPortfolioItem,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem
};
