import { PORTFOLIO_TYPES } from '../models/PortfolioItem.js';

const cleanString = (value) => (typeof value === 'string' ? value.trim() : value);

const normalizeTools = (tools) => {
  if (Array.isArray(tools)) {
    return tools.map(cleanString).filter(Boolean);
  }

  if (typeof tools === 'string') {
    return tools
      .split(',')
      .map((tool) => tool.trim())
      .filter(Boolean);
  }

  return [];
};

const parseBoolean = (value) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }

  return Boolean(value);
};

const normalizePortfolioPayload = (body, isPartial = false) => {
  const payload = {};

  ['title', 'description', 'type', 'category', 'mediaUrl', 'thumbnailUrl', 'cloudinaryPublicId'].forEach((field) => {
    if (!isPartial || body[field] !== undefined) {
      payload[field] = cleanString(body[field]) || '';
    }
  });

  if (!isPartial || body.tools !== undefined) {
    payload.tools = normalizeTools(body.tools);
  }

  if (!isPartial || body.featured !== undefined) {
    payload.featured = parseBoolean(body.featured);
  }

  return payload;
};

const validatePortfolioPayload = (payload, isPartial = false) => {
  const errors = [];

  const requiredFields = ['title', 'description', 'type', 'category', 'mediaUrl'];
  requiredFields.forEach((field) => {
    if (!isPartial && !payload[field]) {
      errors.push(`${field} is required`);
    }
  });

  if (payload.type && !PORTFOLIO_TYPES.includes(payload.type)) {
    errors.push(`type must be one of: ${PORTFOLIO_TYPES.join(', ')}`);
  }

  if (payload.tools?.length > 12) {
    errors.push('tools cannot contain more than 12 items');
  }

  return errors;
};

export { normalizePortfolioPayload, validatePortfolioPayload };
