const getCreatedTime = (item) => new Date(item.createdAt || item.projectDate || 0).getTime() || 0;

const sortPortfolioItems = (items = []) => [...items].sort((left, right) => {
  if (Boolean(left.featured) !== Boolean(right.featured)) {
    return left.featured ? -1 : 1;
  }

  const leftOrder = left.sortOrder ?? Number.POSITIVE_INFINITY;
  const rightOrder = right.sortOrder ?? Number.POSITIVE_INFINITY;

  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  return getCreatedTime(right) - getCreatedTime(left);
});

const isVideoProject = (item) => item?.type === 'video' || item?.type === 'reel';

export { isVideoProject, sortPortfolioItems };
