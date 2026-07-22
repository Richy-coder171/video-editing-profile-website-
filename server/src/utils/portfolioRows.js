import { PORTFOLIO_TYPES } from '../config/portfolioTypes.js';

const normalizeTools = (tools) => {
  if (Array.isArray(tools)) {
    return tools.map((tool) => String(tool).trim()).filter(Boolean);
  }

  return String(tools || '')
    .split(',')
    .map((tool) => tool.trim())
    .filter(Boolean);
};

const parseFeatured = (value) => value === true || value === 'true' || value === 'on';

const parseBoolean = (value) => value === true || value === 'true' || value === 'on' || value === '1';

const parseStatus = (value) => {
  const status = String(value || 'published').trim().toLowerCase();
  return ['draft', 'published'].includes(status) ? status : 'published';
};

const normalizeExternalUrl = (value) => {
  const normalized = String(value || '').trim();
  if (!normalized) return '';

  let parsed;
  try {
    parsed = new URL(normalized);
  } catch {
    const error = new Error('external_url must be a valid URL');
    error.statusCode = 400;
    throw error;
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    const error = new Error('external_url must use http or https');
    error.statusCode = 400;
    throw error;
  }

  return parsed.toString();
};

const parseSortOrder = (value) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : null;
};

const parseProjectDate = (value) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const normalized = String(value).trim().slice(0, 10);
  const match = normalized.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    const error = new Error('project_date must use YYYY-MM-DD format');
    error.statusCode = 400;
    throw error;
  }

  const [, yearValue, monthValue, dayValue] = match;
  const year = Number(yearValue);
  const month = Number(monthValue);
  const day = Number(dayValue);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  const isValidDate =
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day;

  if (!isValidDate) {
    const error = new Error('project_date must be a real calendar date');
    error.statusCode = 400;
    throw error;
  }

  return normalized;
};

const normalizePortfolioRow = (row = {}) => {
  const resourceType = row.resource_type || (row.type === 'reel' || row.type === 'video' ? 'video' : 'image');
  const mediaUrl = row.media_url || '';
  const thumbnailUrl = row.thumbnail_url || mediaUrl;

  return {
    id: row.id,
    _id: row.id,
    title: row.title || '',
    description: row.description || '',
    type: row.type || '',
    category: row.category || '',
    projectDate: row.project_date || '',
    role: row.role || '',
    projectGoal: row.project_goal || '',
    process: row.process || '',
    result: row.result || '',
    aspectRatio: row.aspect_ratio || '',
    format: row.format || '',
    duration: row.duration || '',
    deliveryTime: row.delivery_time || '',
    externalUrl: row.external_url || '',
    clientName: row.client_name || '',
    beforeMediaUrl: row.before_media_url || '',
    beforePublicId: row.before_public_id || '',
    afterMediaUrl: row.after_media_url || mediaUrl,
    afterPublicId: row.after_public_id || row.cloudinary_public_id || '',
    tools: normalizeTools(row.tools),
    mediaUrl,
    thumbnailUrl,
    cloudinaryPublicId: row.cloudinary_public_id || '',
    publicId: row.cloudinary_public_id || '',
    thumbnailPublicId: row.thumbnail_public_id || '',
    resourceType,
    featured: Boolean(row.featured),
    isVisible: row.is_visible !== false,
    status: row.status || 'published',
    sortOrder: row.sort_order ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

const validatePortfolioPayload = ({ title, type }, { requireTitle = true, requireType = true } = {}) => {
  const errors = [];

  if (requireTitle && !String(title || '').trim()) {
    errors.push('title is required');
  }

  if (requireType && !PORTFOLIO_TYPES.includes(type)) {
    errors.push(`type must be one of: ${PORTFOLIO_TYPES.join(', ')}`);
  }

  return errors;
};

export {
  normalizeExternalUrl,
  normalizePortfolioRow,
  normalizeTools,
  parseBoolean,
  parseFeatured,
  parseProjectDate,
  parseSortOrder,
  parseStatus,
  validatePortfolioPayload
};
