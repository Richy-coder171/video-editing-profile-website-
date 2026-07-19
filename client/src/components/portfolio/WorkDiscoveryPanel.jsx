import { Search, SlidersHorizontal, Star, X } from 'lucide-react';

const sortOptions = [
  { label: 'Featured first', value: 'featured' },
  { label: 'Newest first', value: 'newest' },
  { label: 'Oldest first', value: 'oldest' },
  { label: 'A to Z', value: 'title' }
];

const WorkDiscoveryPanel = ({
  query,
  onQueryChange,
  sortBy,
  onSortChange,
  featuredOnly,
  onFeaturedOnlyChange,
  totalCount,
  visibleCount,
  summaryItems = [],
  placeholder = 'Search work'
}) => (
  <div className="anime-surface mt-6 rounded-lg p-4 sm:p-5">
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-center">
      <label className="relative block">
        <span className="sr-only">Search portfolio work</span>
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35" size={18} />
        <input
          className="input mt-0 min-h-12 pl-11 pr-11"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={placeholder}
          type="search"
        />
        {query && (
          <button
            className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-white/45 transition hover:bg-white/10 hover:text-white"
            type="button"
            onClick={() => onQueryChange('')}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </label>

      <label className="relative block min-w-[12rem]">
        <span className="sr-only">Sort portfolio work</span>
        <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35" size={18} />
        <select
          className="input mt-0 min-h-12 pl-11"
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <button
        className={`btn-secondary min-h-12 justify-center ${featuredOnly ? 'border-acid/70 bg-acid/15 text-acid' : ''}`}
        type="button"
        onClick={() => onFeaturedOnlyChange(!featuredOnly)}
        aria-pressed={featuredOnly}
      >
        <Star size={16} fill={featuredOnly ? 'currentColor' : 'none'} />
        Featured
      </button>
    </div>

    <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-white/45">
        Showing <span className="text-frost">{visibleCount}</span> of <span className="text-frost">{totalCount}</span> works
      </p>
      {summaryItems.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {summaryItems.map((item) => (
            <span key={item.label} className="meta-pill">
              <span className="text-frost">{item.value}</span>
              {item.label}
            </span>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default WorkDiscoveryPanel;
