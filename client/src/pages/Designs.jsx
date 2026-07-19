import { useMemo, useState } from 'react';
import EmptyState from '../components/portfolio/EmptyState.jsx';
import PortfolioGrid from '../components/portfolio/PortfolioGrid.jsx';
import WorkDiscoveryPanel from '../components/portfolio/WorkDiscoveryPanel.jsx';
import LazyPage3DAccent from '../components/three/LazyPage3DAccent.jsx';
import usePortfolio from '../hooks/usePortfolio.js';
import { designTabs, designTypes } from '../data/portfolioMeta.js';
import { applyWorkFilters, getWorkSummary } from '../utils/workPresentation.js';

const Designs = () => {
  const { items, loading, error } = usePortfolio('/portfolio');
  const [activeType, setActiveType] = useState('all');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const designItems = useMemo(() => items.filter((item) => designTypes.includes(item.type)), [items]);

  const typeItems = useMemo(() => {
    if (activeType === 'all') {
      return designItems;
    }

    return designItems.filter((item) => item.type === activeType);
  }, [activeType, designItems]);
  const filteredItems = useMemo(
    () => applyWorkFilters(typeItems, { query, sortBy, featuredOnly }),
    [featuredOnly, query, sortBy, typeItems]
  );
  const summary = useMemo(() => getWorkSummary(typeItems), [typeItems]);
  const hasUploads = designItems.length > 0;

  return (
    <main className="page-pad bg-graphite">
      <section className="section-shell">
        <div className="page-hero grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div className="absolute inset-0 bg-cinematic-sheen opacity-30" />
          <div className="absolute inset-0 bg-manga-lines opacity-10" />
          <LazyPage3DAccent
            variant="designs"
            className="right-[-12rem] top-24 h-[18rem] w-[25rem] opacity-24 sm:right-[-7rem] sm:top-8 sm:h-[22rem] sm:w-[29rem] sm:opacity-45 lg:right-[1rem] lg:top-[-2rem] lg:h-[25rem] lg:w-[32rem] lg:opacity-70"
          />
          <div className="relative z-10">
            <p className="eyebrow">Design gallery</p>
            <h1 className="page-title mt-4 max-w-4xl">
              Photoshop and Illustrator work with cinematic visual hierarchy.
            </h1>
          </div>
          <div className="relative z-10 grid gap-3 sm:grid-cols-3">
            {[
              ['PSD', 'Composites'],
              ['AI', 'Vector systems'],
              ['Social', 'Launch assets']
            ].map(([value, label]) => (
              <div key={value} className="anime-surface rounded-lg p-4">
                <p className="font-display text-2xl font-bold text-white">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/50">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible">
          {designTabs.map((tab) => (
            <button
              key={tab.value}
              className={`filter-chip shrink-0 ${activeType === tab.value ? 'filter-chip-active' : ''}`}
              onClick={() => setActiveType(tab.value)}
            >
              {tab.label}
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
            totalCount={typeItems.length}
            visibleCount={filteredItems.length}
            placeholder="Search designs, tools, formats, categories"
            summaryItems={[
              { label: 'featured', value: summary.featured },
              { label: 'categories', value: summary.categories },
              { label: 'tools', value: summary.tools }
            ]}
          />
        )}
        {loading && <p className="mt-6 text-sm text-white/60">Loading design work...</p>}
        {error && <p className="mt-6 rounded-lg border border-ember/30 bg-ember/10 p-3 text-sm text-ember">{error}</p>}
        <div className="mt-8 sm:mt-12">
          {filteredItems.length ? (
            <PortfolioGrid items={filteredItems} variant="design" columns="lg:grid-cols-3" />
          ) : (
            !loading && (
              <EmptyState
                title={hasUploads ? 'No design work matches this view.' : undefined}
                message={hasUploads ? 'Try a different search, design type, sort, or featured filter.' : undefined}
                showAdminAction={!hasUploads}
              />
            )
          )}
        </div>
      </section>
    </main>
  );
};

export default Designs;
