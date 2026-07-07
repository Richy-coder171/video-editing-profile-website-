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
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="eyebrow">Design gallery</p>
        <h1 className="mt-4 max-w-4xl font-display text-5xl font-black leading-none text-white md:text-7xl">
          Photoshop and Illustrator work with cinematic visual hierarchy.
        </h1>
        <div className="mt-8 flex flex-wrap gap-2">
          {['All', ...designCategories].map((category) => (
            <button
              key={category}
              className={`rounded-full px-4 py-2 text-sm transition ${
                activeCategory === category ? 'bg-white text-ink' : 'border border-white/10 text-white/60 hover:text-white'
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        {error && <p className="mt-6 text-sm text-ember">{error}</p>}
        {loading && <p className="mt-6 text-sm text-white/60">Loading design work...</p>}
        <div className="mt-12">
          <PortfolioGrid items={filteredItems} variant="design" columns="lg:grid-cols-3" />
        </div>
      </section>
    </main>
  );
};

export default Designs;
