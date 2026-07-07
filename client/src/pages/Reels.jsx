import PortfolioGrid from '../components/portfolio/PortfolioGrid.jsx';
import usePortfolio from '../hooks/usePortfolio.js';

const Reels = () => {
  const { items, loading, error } = usePortfolio('/portfolio/type/reel', (item) => item.type === 'reel');

  return (
    <main className="page-pad bg-ink">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="eyebrow">Reels and shorts</p>
        <h1 className="mt-4 max-w-4xl font-display text-5xl font-black leading-none text-white md:text-7xl">
          Vertical edits built for hooks, holds, and replay value.
        </h1>
        <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/60">
          <span>9:16 cards</span>
          <span>Muted preview-ready</span>
          <span>Poster-first loading</span>
        </div>
        {error && <p className="mt-6 text-sm text-ember">{error}</p>}
        {loading && <p className="mt-6 text-sm text-white/60">Loading reel wall...</p>}
        <div className="mt-12">
          <PortfolioGrid items={items} variant="reel" columns="lg:grid-cols-4" />
        </div>
      </section>
    </main>
  );
};

export default Reels;
