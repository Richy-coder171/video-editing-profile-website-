import { getSupabaseClient } from '../config/supabase.js';
import { PORTFOLIO_TYPES } from '../config/portfolioTypes.js';
import asyncHandler from '../utils/asyncHandler.js';
import { deleteFromCloudinary } from '../utils/cloudinaryUpload.js';
import {
  normalizePortfolioRow,
  normalizeExternalUrl,
  normalizeTools,
  parseBoolean,
  parseFeatured,
  parseProjectDate,
  parseSortOrder,
  parseStatus
} from '../utils/portfolioRows.js';

const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

const getLimit = (value, fallback = 60) => Math.min(Math.max(Number(value) || fallback, 1), 200);

const optionalTextFields = {
  role: 'role',
  project_goal: 'project_goal',
  projectGoal: 'project_goal',
  process: 'process',
  result: 'result',
  aspect_ratio: 'aspect_ratio',
  aspectRatio: 'aspect_ratio',
  client_name: 'client_name',
  clientName: 'client_name',
  format: 'format',
  duration: 'duration',
  delivery_time: 'delivery_time',
  deliveryTime: 'delivery_time',
  before_public_id: 'before_public_id',
  beforePublicId: 'before_public_id',
  after_public_id: 'after_public_id',
  afterPublicId: 'after_public_id'
};

const throwSupabaseError = (error, fallbackMessage = 'Supabase request failed') => {
  const tableMissing =
    error?.code === 'PGRST205' ||
    error?.message?.includes("Could not find the table 'public.portfolio_items'");
  const columnMissing = error?.code === 'PGRST204';
  let message = error?.message || fallbackMessage;

  if (tableMissing) {
    message = 'Supabase table public.portfolio_items was not found. Run supabase/schema.sql in the Supabase SQL Editor, then restart or refresh the app.';
  }

  if (columnMissing) {
    message = 'One or more portfolio columns are missing in Supabase. Run the migration in supabase/schema.sql, then restart or refresh the app.';
  }

  const requestError = new Error(message);
  requestError.statusCode = error?.code === 'PGRST116' ? 404 : 500;
  throw requestError;
};

const fetchPortfolioRows = async ({ limit = 200 } = {}) => {
  const supabase = getSupabaseClient();
  return supabase
    .from('portfolio_items')
    .select('*')
    .order('featured', { ascending: false })
    .order('sort_order', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(getLimit(limit));
};

const isPublicPortfolioRow = (row = {}) => row.is_visible !== false && (row.status || 'published') === 'published';

const filterPortfolioRows = (rows = [], { type, featured, limit, publicOnly = true } = {}) => rows
  .filter((row) => !publicOnly || isPublicPortfolioRow(row))
  .filter((row) => !type || row.type === type)
  .filter((row) => !featured || row.featured === true)
  .slice(0, getLimit(limit));

const getPortfolioItems = asyncHandler(async (req, res) => {
  const { type, featured, limit = 60 } = req.query;

  if (type && !PORTFOLIO_TYPES.includes(type)) {
    res.status(400);
    throw new Error(`type must be one of: ${PORTFOLIO_TYPES.join(', ')}`);
  }

  const shouldFilterAfterFetch = Boolean(type || featured === 'true');
  const { data, error } = await fetchPortfolioRows({ limit: shouldFilterAfterFetch ? 200 : limit });

  if (error) {
    throwSupabaseError(error);
  }

  const rows = filterPortfolioRows(data || [], { type, featured: featured === 'true', limit });
  const items = rows.map(normalizePortfolioRow);
  res.json({ items, count: items.length });
});

const getAdminPortfolioItems = asyncHandler(async (req, res) => {
  const { limit = 120 } = req.query;
  const { data, error } = await fetchPortfolioRows({ limit });

  if (error) {
    throwSupabaseError(error);
  }

  const items = filterPortfolioRows(data || [], { limit, publicOnly: false }).map(normalizePortfolioRow);
  res.json({ items, count: items.length });
});

const getFeaturedItems = asyncHandler(async (_req, res) => {
  const { data, error } = await fetchPortfolioRows({ limit: 200 });

  if (error) {
    throwSupabaseError(error);
  }

  const items = filterPortfolioRows(data || [], { featured: true, limit: 12 }).map(normalizePortfolioRow);
  res.json({ items, count: items.length });
});

const getPortfolioItem = asyncHandler(async (req, res) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('portfolio_items')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) {
    throwSupabaseError(error, 'Portfolio item not found');
  }

  if (!isPublicPortfolioRow(data)) {
    res.status(404);
    throw new Error('Portfolio item not found');
  }

  const item = normalizePortfolioRow(data);
  res.json({ item, ...item });
});

const getItemsByType = asyncHandler(async (req, res) => {
  const { type } = req.params;

  if (!PORTFOLIO_TYPES.includes(type)) {
    res.status(400);
    throw new Error(`type must be one of: ${PORTFOLIO_TYPES.join(', ')}`);
  }

  const { data, error } = await fetchPortfolioRows({ limit: 200 });

  if (error) {
    throwSupabaseError(error);
  }

  const items = filterPortfolioRows(data || [], { type, limit: req.query.limit || 100 }).map(normalizePortfolioRow);
  res.json({ items, count: items.length });
});

const buildUpdatePayload = (body) => {
  const payload = {};
  const errors = [];

  if (hasOwn(body, 'title')) {
    const title = String(body.title || '').trim();
    if (!title) {
      errors.push('title is required');
    }
    payload.title = title;
  }

  if (hasOwn(body, 'description')) {
    payload.description = String(body.description || '').trim();
  }

  if (hasOwn(body, 'type')) {
    if (!PORTFOLIO_TYPES.includes(body.type)) {
      errors.push(`type must be one of: ${PORTFOLIO_TYPES.join(', ')}`);
    }
    payload.type = body.type;
  }

  if (hasOwn(body, 'category')) {
    payload.category = String(body.category || '').trim();
  }

  Object.entries(optionalTextFields).forEach(([inputKey, databaseKey]) => {
    if (hasOwn(body, inputKey)) {
      payload[databaseKey] = String(body[inputKey] || '').trim();
    }
  });

  const externalUrl = hasOwn(body, 'external_url') ? body.external_url : body.externalUrl;
  if (externalUrl !== undefined) {
    payload.external_url = normalizeExternalUrl(externalUrl);
  }

  const projectDate = hasOwn(body, 'project_date') ? body.project_date : body.projectDate;
  if (projectDate !== undefined) {
    payload.project_date = parseProjectDate(projectDate);
  }

  const beforeMediaUrl = hasOwn(body, 'before_media_url') ? body.before_media_url : body.beforeMediaUrl;
  if (beforeMediaUrl !== undefined) {
    payload.before_media_url = normalizeExternalUrl(beforeMediaUrl);
  }

  const afterMediaUrl = hasOwn(body, 'after_media_url') ? body.after_media_url : body.afterMediaUrl;
  if (afterMediaUrl !== undefined) {
    payload.after_media_url = normalizeExternalUrl(afterMediaUrl);
  }

  if (hasOwn(body, 'tools')) {
    payload.tools = normalizeTools(body.tools);
  }

  if (hasOwn(body, 'featured')) {
    payload.featured = parseFeatured(body.featured);
  }

  const isVisible = hasOwn(body, 'is_visible') ? body.is_visible : body.isVisible;
  if (isVisible !== undefined) {
    payload.is_visible = parseBoolean(isVisible);
  }

  if (hasOwn(body, 'status')) {
    payload.status = parseStatus(body.status);
  }

  const sortOrder = hasOwn(body, 'sort_order') ? body.sort_order : body.sortOrder;
  if (sortOrder !== undefined) {
    payload.sort_order = parseSortOrder(sortOrder);
  }

  const thumbnailUrl = hasOwn(body, 'thumbnail_url') ? body.thumbnail_url : body.thumbnailUrl;
  if (thumbnailUrl !== undefined) {
    payload.thumbnail_url = String(thumbnailUrl || '').trim();
  }

  if (errors.length) {
    const error = new Error(errors.join(', '));
    error.statusCode = 400;
    throw error;
  }

  payload.updated_at = new Date().toISOString();
  return payload;
};

const updatePortfolioItem = asyncHandler(async (req, res) => {
  const payload = buildUpdatePayload(req.body);
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('portfolio_items')
    .update(payload)
    .eq('id', req.params.id)
    .select('*')
    .single();

  if (error) {
    throwSupabaseError(error, 'Unable to update portfolio item');
  }

  const item = normalizePortfolioRow(data);
  res.json({ item, ...item });
});

const deletePortfolioItem = asyncHandler(async (req, res) => {
  const supabase = getSupabaseClient();
  const { data: row, error: findError } = await supabase
    .from('portfolio_items')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (findError) {
    throwSupabaseError(findError, 'Portfolio item not found');
  }

  await deleteFromCloudinary(row.cloudinary_public_id, row.resource_type || 'image');

  if (row.thumbnail_public_id) {
    await deleteFromCloudinary(row.thumbnail_public_id, 'image');
  }

  const { error: deleteError } = await supabase.from('portfolio_items').delete().eq('id', req.params.id);

  if (deleteError) {
    throwSupabaseError(deleteError, 'Unable to delete portfolio item');
  }

  res.json({ message: 'Portfolio item deleted' });
});

export {
  getAdminPortfolioItems,
  getPortfolioItem,
  getPortfolioItems,
  getFeaturedItems,
  getItemsByType,
  updatePortfolioItem,
  deletePortfolioItem
};
