import { useMemo, useState } from 'react';
import PortfolioGrid from '../components/portfolio/PortfolioGrid.jsx';
import usePortfolio from '../hooks/usePortfolio.js';
import { designCategories } from '../data/fallbackPortfolio.js';

const Designs = () => {
  const { items, loading, error } = usePortfolio('/portfolio', (item) => item.type === 'photoshop' || item.type === 'illustrator');
  const designItems = items.filter((item) => item.type === 'photoshop' || item.type === 'illustrator');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') {
      return designItems;
    }

    if (activeCategory === 'Photoshop') {
      return designItems.filter((item) => item.type === 'photoshop');
    }

    if (activeCategory === 'Illustrator') {
      return designItems.filter((item) => item.type === 'illustrator');
    }

    return designItems.filter((item) => item.category === activeCategory);
  }, [activeCategory, designItems]);

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
          {['All', ...designCategories].map((category) => (
            <button
              key={category}
              className={`filter-chip shrink-0 ${activeCategory === category ? 'filter-chip-active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        {error && <p className="mt-6 text-sm text-ember">{error}</p>}
        {loading && <p className="mt-6 text-sm text-white/60">Loading design work...</p>}
        <div className="mt-8 sm:mt-12">
          <PortfolioGrid items={filteredItems} variant="design" columns="lg:grid-cols-3" />
        </div>
      </section>
    </main>
  );
};

export default Designs;
