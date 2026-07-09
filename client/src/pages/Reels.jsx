import PortfolioGrid from '../components/portfolio/PortfolioGrid.jsx';
import EmptyState from '../components/portfolio/EmptyState.jsx';
import usePortfolio from '../hooks/usePortfolio.js';

const Reels = () => {
  const { items, loading } = usePortfolio('/portfolio/type/reel');

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
          <div className="relative">
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
        {loading && <p className="mt-6 text-sm text-white/60">Loading reel wall...</p>}
        <div className="mt-8 sm:mt-12">
          {items.length ? <PortfolioGrid items={items} variant="reel" columns="lg:grid-cols-4" /> : !loading && <EmptyState />}
        </div>
      </section>
    </main>
  );
};

export default Reels;
