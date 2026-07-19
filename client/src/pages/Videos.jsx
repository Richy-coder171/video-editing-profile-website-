import { useMemo, useState } from 'react';
import EmptyState from '../components/portfolio/EmptyState.jsx';
import PortfolioGrid from '../components/portfolio/PortfolioGrid.jsx';
import WorkDiscoveryPanel from '../components/portfolio/WorkDiscoveryPanel.jsx';
import LazyPage3DAccent from '../components/three/LazyPage3DAccent.jsx';
import usePortfolio from '../hooks/usePortfolio.js';
import { videoCategories } from '../data/portfolioMeta.js';
import { applyWorkFilters, getWorkSummary } from '../utils/workPresentation.js';

const Videos = () => {
  const { items, loading, error } = usePortfolio('/portfolio/type/video');
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const categoryItems = useMemo(() => {
    if (activeCategory === 'All') {
      return items;
    }

    return items.filter((item) => item.category === activeCategory);
  }, [activeCategory, items]);
  const filteredItems = useMemo(
    () => applyWorkFilters(categoryItems, { query, sortBy, featuredOnly }),
    [categoryItems, featuredOnly, query, sortBy]
  );
  const summary = useMemo(() => getWorkSummary(categoryItems), [categoryItems]);
  const hasUploads = items.length > 0;

  return (
    <main className="page-pad bg-black">
      <section className="section-shell">
        <div className="page-hero grid gap-8 lg:grid-cols-[1fr_0.38fr] lg:items-end">
          <div className="absolute inset-0 bg-cinematic-sheen opacity-35" />
          <div className="absolute inset-0 bg-manga-lines opacity-10" />
          <LazyPage3DAccent
            variant="videos"
            className="right-[-9rem] top-12 h-[18rem] w-[26rem] opacity-30 sm:right-[-6rem] sm:top-5 sm:h-[22rem] sm:w-[30rem] sm:opacity-50 lg:right-[7rem] lg:top-[-1.5rem] lg:h-[24rem] lg:w-[31rem] lg:opacity-65"
          />
          <div className="relative z-10">
            <p className="eyebrow">Long-form edits</p>
            <h1 className="page-title mt-4 max-w-4xl">
              Widescreen stories with cinematic pacing and polish.
            </h1>
          </div>
          <div className="anime-surface relative z-10 rounded-lg p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-white/50">Delivery format</p>
            <p className="mt-3 font-display text-3xl font-bold text-white">16:9</p>
            <p className="mt-2 text-sm leading-6 text-white/60">YouTube, ads, podcasts, gaming edits, and color grade reels.</p>
          </div>
        </div>
        <div className="mt-8 flex gap-2 overflow-x-auto pb-3 sm:flex-wrap sm:overflow-visible">
          {['All', ...videoCategories].map((category) => (
            <button
              key={category}
              className={`filter-chip shrink-0 ${activeCategory === category ? 'filter-chip-active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        {hasUploads && (
          <WorkDiscoveryPanel
            query={query}
            onQueryChange={setQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            featuredOnly={featuredOnly}
            onFeaturedOnlyChange={setFeaturedOnly}
            totalCount={categoryItems.length}
            visibleCount={filteredItems.length}
            placeholder="Search videos, edits, tools, categories"
            summaryItems={[
              { label: 'featured', value: summary.featured },
              { label: 'categories', value: summary.categories },
              { label: 'tools', value: summary.tools }
            ]}
          />
        )}
        {loading && <p className="mt-6 text-sm text-white/60">Loading video edits...</p>}
        {error && <p className="mt-6 rounded-lg border border-ember/30 bg-ember/10 p-3 text-sm text-ember">{error}</p>}
        <div className="mt-8 sm:mt-12">
          {filteredItems.length ? (
            <PortfolioGrid items={filteredItems} variant="video" columns="lg:grid-cols-2" />
          ) : (
            !loading && (
              <EmptyState
                title={hasUploads ? 'No videos match this view.' : undefined}
                message={hasUploads ? 'Try a different search, category, sort, or featured filter.' : undefined}
                showAdminAction={!hasUploads}
              />
            )
          )}
        </div>
      </section>
    </main>
  );
};

export default Videos;
