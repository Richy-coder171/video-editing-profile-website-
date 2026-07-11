import { useState } from 'react';
import EmptyState from '../portfolio/EmptyState.jsx';
import MediaCard from '../portfolio/MediaCard.jsx';
import ProjectLightbox from '../portfolio/ProjectLightbox.jsx';
import { sortPortfolioItems } from '../../utils/portfolio.js';

const FeaturedShowcase = ({ items }) => {
  const [activeItem, setActiveItem] = useState(null);
  const bestWork = sortPortfolioItems(items).slice(0, 9);

  return (
    <section className="section-pad relative overflow-hidden bg-ink">
      <div className="section-shell">
        <div className="mb-10 grid gap-5 border-b border-white/15 pb-7 md:grid-cols-[1fr_0.42fr] md:items-end">
          <div>
            <p className="eyebrow">Best work / 02</p>
            <h2 className="reveal-text section-title mt-3 max-w-3xl">The work, without the scavenger hunt.</h2>
          </div>
          <p className="max-w-md border-l border-white/15 pl-4 text-sm leading-7 text-white/55">Featured projects come first, followed by your chosen order and newest uploads. Open any piece or view its full project page.</p>
        </div>

        {bestWork.length ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {bestWork.map((item, index) => (
              <MediaCard
                key={item.id}
                item={item}
                index={index}
                variant={item.type === 'reel' ? 'reel' : item.type === 'video' ? 'video' : 'design'}
                onOpen={setActiveItem}
              />
            ))}
          </div>
        ) : <EmptyState />}
      </div>
      <ProjectLightbox item={activeItem} items={bestWork} onChange={setActiveItem} onClose={() => setActiveItem(null)} />
    </section>
  );
};

export default FeaturedShowcase;
