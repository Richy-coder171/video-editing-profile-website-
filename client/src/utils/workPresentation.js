import { sortPortfolioItems } from './portfolio.js';

const getProjectTimestamp = (item) => {
  const value = item?.projectDate || item?.createdAt || item?.updatedAt;
  const timestamp = value ? Date.parse(value) : 0;
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const getSearchText = (item) => [
  item?.title,
  item?.description,
  item?.type,
  item?.category,
  ...(item?.tools || [])
].filter(Boolean).join(' ').toLowerCase();

const applyWorkFilters = (items = [], { query = '', sortBy = 'featured', featuredOnly = false } = {}) => {
  const searchTerm = query.trim().toLowerCase();
  const filteredItems = items.filter((item) => {
    if (featuredOnly && !item.featured) {
      return false;
    }

    if (!searchTerm) {
      return true;
    }

    return getSearchText(item).includes(searchTerm);
  });

  if (sortBy === 'newest') {
    return [...filteredItems].sort((left, right) => getProjectTimestamp(right) - getProjectTimestamp(left));
  }

  if (sortBy === 'oldest') {
    return [...filteredItems].sort((left, right) => getProjectTimestamp(left) - getProjectTimestamp(right));
  }

  if (sortBy === 'title') {
    return [...filteredItems].sort((left, right) => String(left.title || '').localeCompare(String(right.title || '')));
  }

  return sortPortfolioItems(filteredItems);
};

const getWorkSummary = (items = []) => {
  const tools = new Set();
  const categories = new Set();

  items.forEach((item) => {
    if (item.category) {
      categories.add(item.category);
    }

    (item.tools || []).forEach((tool) => tools.add(tool));
  });

  return {
    total: items.length,
    featured: items.filter((item) => item.featured).length,
    dated: items.filter((item) => item.projectDate || item.createdAt).length,
    categories: categories.size,
    tools: tools.size
  };
};

export { applyWorkFilters, getWorkSummary, getProjectTimestamp };
