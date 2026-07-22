import { useMemo, useState } from 'react';
import PortfolioGrid from '../components/portfolio/PortfolioGrid.jsx';
import EmptyState from '../components/portfolio/EmptyState.jsx';
import WorkDiscoveryPanel from '../components/portfolio/WorkDiscoveryPanel.jsx';
import LazyPage3DAccent from '../components/three/LazyPage3DAccent.jsx';
import usePortfolio from '../hooks/usePortfolio.js';
import { applyWorkFilters, getWorkSummary } from '../utils/workPresentation.js';

const Reels = () => {
  const { items, loading, error } = usePortfolio('/portfolio/type/reel');
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const reelCategories = ['All', 'Instagram Reels', 'YouTube Shorts', 'Gaming', 'Cinematic', 'Ads'];
  const categoryItems = useMemo(() => {
    if (activeCategory === 'All') return items;
    const category = activeCategory.toLowerCase();
    const terms = category === 'youtube shorts' ? ['youtube', 'short'] : category === 'instagram reels' ? ['instagram', 'reel'] : [category];
    return items.filter((item) => terms.some((term) => String(item.category || '').toLowerCase().includes(term)));
  }, [activeCategory, items]);
  const filteredItems = useMemo(
    () => applyWorkFilters(categoryItems, { query, sortBy, featuredOnly }),
    [categoryItems, featuredOnly, query, sortBy]
  );
  const summary = useMemo(() => getWorkSummary(categoryItems), [categoryItems]);
  const hasUploads = items.length > 0;

  return (
    <main className="page-pad bg-ink">
      <section className="section-shell">
        <div className="page-hero">
          <img
            src="/cinematic-editor-hero.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/55" />
          <div className="absolute inset-0 bg-manga-lines opacity-10" />
          <LazyPage3DAccent
            variant="reels"
            className="right-[-9rem] top-14 h-[18rem] w-[24rem] opacity-30 sm:right-[-7rem] sm:top-7 sm:h-[22rem] sm:w-[28rem] sm:opacity-50 lg:right-[-3rem] lg:top-[-1rem] lg:h-[25rem] lg:w-[32rem] lg:opacity-75"
          />
          <div className="relative z-10">
            <p className="eyebrow">Reels and shorts</p>
            <h1 className="page-title mt-4 max-w-4xl">
              Vertical edits built for hooks, holds, and replay value.
            </h1>
            <div className="mt-6 flex flex-wrap gap-2 text-sm text-white/60">
              {['9:16 frame', 'Hook-focused', 'Mobile-first'].map((label) => (
                <span key={label} className="meta-pill">
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 flex gap-2 overflow-x-auto pb-3 sm:flex-wrap sm:overflow-visible">
          {reelCategories.map((category) => (
            <button key={category} className={`filter-chip shrink-0 ${activeCategory === category ? 'filter-chip-active' : ''}`} onClick={() => setActiveCategory(category)}>{category}</button>
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
            placeholder="Search reels, hooks, tools, categories"
            summaryItems={[
              { label: 'featured', value: summary.featured },
              { label: 'categories', value: summary.categories },
              { label: 'tools', value: summary.tools }
            ]}
          />
        )}
        {loading && <p className="mt-6 text-sm text-white/60">Loading reel wall...</p>}
        {error && <p className="mt-6 rounded-lg border border-ember/30 bg-ember/10 p-3 text-sm text-ember">{error}</p>}
        <div className="mt-8 sm:mt-12">
          {filteredItems.length ? (
            <PortfolioGrid items={filteredItems} variant="reel" columns="lg:grid-cols-3" />
          ) : (
            !loading && (
              <EmptyState
                title={hasUploads ? 'No reels match this view.' : undefined}
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

export default Reels;
