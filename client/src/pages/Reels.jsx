import PortfolioGrid from '../components/portfolio/PortfolioGrid.jsx';
import usePortfolio from '../hooks/usePortfolio.js';

const Reels = () => {
  const { items, loading, error } = usePortfolio('/portfolio/type/reel', (item) => item.type === 'reel');

  return (
    <main className="page-pad bg-ink">
      <section className="section-shell">
        <div className="relative overflow-hidden rounded-lg border border-white/10 bg-black p-6 sm:p-8 lg:p-10">
          <img
            src="/cinematic-editor-hero.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/50" />
          <div className="relative">
            <p className="eyebrow">Reels and shorts</p>
            <h1 className="page-title mt-4 max-w-4xl">
              Vertical edits built for hooks, holds, and replay value.
            </h1>
            <div className="mt-6 flex flex-wrap gap-2 text-sm text-white/60">
              {['9:16 frame', 'Hook-focused', 'Mobile-first'].map((label) => (
                <span key={label} className="rounded-full border border-white/10 bg-white/10 px-3 py-1">
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
        {error && <p className="mt-6 text-sm text-ember">{error}</p>}
        {loading && <p className="mt-6 text-sm text-white/60">Loading reel wall...</p>}
        <div className="mt-8 sm:mt-12">
          <PortfolioGrid items={items} variant="reel" columns="lg:grid-cols-4" />
        </div>
      </section>
    </main>
  );
};

export default Reels;
