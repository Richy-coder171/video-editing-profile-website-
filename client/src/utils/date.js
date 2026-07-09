const formatProjectDate = (value) => {
  if (!value) {
    return '';
  }

  const [yearValue, monthValue, dayValue] = String(value).slice(0, 10).split('-');
  const year = Number(yearValue);
  const month = Number(monthValue);
  const day = Number(dayValue);

  if (!year || !month || !day) {
    return '';
  }

  const date = new Date(Date.UTC(year, month - 1, day));

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(date);
};

export { formatProjectDate };
