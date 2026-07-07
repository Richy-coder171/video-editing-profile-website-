import { useMemo, useState } from 'react';
import EmptyState from '../components/portfolio/EmptyState.jsx';
import PortfolioGrid from '../components/portfolio/PortfolioGrid.jsx';
import usePortfolio from '../hooks/usePortfolio.js';
import { designTabs, designTypes } from '../data/portfolioMeta.js';

const Designs = () => {
  const { items, loading } = usePortfolio('/portfolio');
  const designItems = items.filter((item) => designTypes.includes(item.type));
  const [activeType, setActiveType] = useState('all');

  const filteredItems = useMemo(() => {
    if (activeType === 'all') {
      return designItems;
    }

    return designItems.filter((item) => item.type === activeType);
  }, [activeType, designItems]);

  return (
    <main className="page-pad bg-graphite">
      <section className="section-shell">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="eyebrow">Design gallery</p>
            <h1 className="page-title mt-4 max-w-4xl">
              Photoshop and Illustrator work with cinematic visual hierarchy.
            </h1>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ['PSD', 'Composites'],
              ['AI', 'Vector systems'],
              ['Social', 'Launch assets']
            ].map(([value, label]) => (
              <div key={value} className="panel-premium rounded-lg p-4">
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
        {loading && <p className="mt-6 text-sm text-white/60">Loading design work...</p>}
        <div className="mt-8 sm:mt-12">
          {filteredItems.length ? (
            <PortfolioGrid items={filteredItems} variant="design" columns="lg:grid-cols-3" />
          ) : (
            !loading && <EmptyState />
          )}
        </div>
      </section>
    </main>
  );
};

export default Designs;
