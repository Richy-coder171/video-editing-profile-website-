import { useMemo, useState } from 'react';
import PortfolioGrid from '../components/portfolio/PortfolioGrid.jsx';
import usePortfolio from '../hooks/usePortfolio.js';
import { videoCategories } from '../data/fallbackPortfolio.js';

const Videos = () => {
  const { items, loading, error } = usePortfolio('/portfolio/type/video', (item) => item.type === 'video');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') {
      return items;
    }

    return items.filter((item) => item.category === activeCategory);
  }, [activeCategory, items]);

  return (
    <main className="page-pad bg-black">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="eyebrow">Long-form edits</p>
        <h1 className="mt-4 max-w-4xl font-display text-5xl font-black leading-none text-white md:text-7xl">
          Widescreen stories with cinematic pacing and polish.
        </h1>
        <div className="mt-8 flex flex-wrap gap-2">
          {['All', ...videoCategories].map((category) => (
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
        {loading && <p className="mt-6 text-sm text-white/60">Loading video edits...</p>}
        <div className="mt-12">
          <PortfolioGrid items={filteredItems} variant="video" />
        </div>
      </section>
    </main>
  );
};

export default Videos;
