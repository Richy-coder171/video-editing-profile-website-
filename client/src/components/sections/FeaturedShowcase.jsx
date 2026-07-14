import { useMemo, useState } from 'react';
import { ArrowRight, Grid2X2, Images, Play, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import EmptyState from '../portfolio/EmptyState.jsx';
import MediaCard from '../portfolio/MediaCard.jsx';
import ProjectLightbox from '../portfolio/ProjectLightbox.jsx';
import { isVideoProject, sortPortfolioItems } from '../../utils/portfolio.js';

const filterOptions = [
  { label: 'All work', value: 'all' },
  { label: 'Video', value: 'video' },
  { label: 'Reels', value: 'reel' },
  { label: 'Design', value: 'design' }
];

const isDesignProject = (item) => !isVideoProject(item);

const filterProject = (item, activeFilter) => {
  if (activeFilter === 'all') return true;
  if (activeFilter === 'video') return item.type === 'video';
  if (activeFilter === 'reel') return item.type === 'reel';
  if (activeFilter === 'design') return isDesignProject(item);
  return true;
};

const getVariant = (item) => (item.type === 'reel' ? 'reel' : item.type === 'video' ? 'video' : 'design');

const FeaturedShowcase = ({ items }) => {
  const [activeItem, setActiveItem] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const sortedItems = useMemo(() => sortPortfolioItems(items), [items]);
  const filteredItems = useMemo(
    () => sortedItems.filter((item) => filterProject(item, activeFilter)),
    [activeFilter, sortedItems]
  );
  const visibleItems = filteredItems.slice(0, 10);
  const spotlightItem = visibleItems[0];
  const galleryItems = visibleItems.slice(1);
  const counts = useMemo(
    () => ({
      all: sortedItems.length,
      video: sortedItems.filter((item) => item.type === 'video').length,
      reel: sortedItems.filter((item) => item.type === 'reel').length,
      design: sortedItems.filter(isDesignProject).length,
      featured: sortedItems.filter((item) => item.featured).length
    }),
    [sortedItems]
  );

  return (
    <section className="section-pad relative overflow-hidden bg-ink">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-electric/40 to-transparent" />
      <div className="pointer-events-none absolute left-[-12rem] top-24 h-80 w-80 rounded-full bg-electric/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 right-[-10rem] h-72 w-72 rounded-full bg-acid/10 blur-3xl" />
      <div className="section-shell">
        <div className="mb-8 grid gap-6 border-b border-white/15 pb-7 md:grid-cols-[1fr_0.42fr] md:items-end">
          <div>
            <p className="eyebrow">Best work / 02</p>
            <h2 className="reveal-text section-title mt-3 max-w-4xl">A sharper showcase for the work that matters.</h2>
          </div>
          <div className="space-y-4 md:border-l md:border-white/15 md:pl-4">
            <p className="max-w-md text-sm leading-7 text-white/55">
              Filter real uploads by format, open a quick preview, or jump into a full project page with notes and media.
            </p>
            <div className="grid grid-cols-3 gap-2 text-center font-mono text-[0.58rem] uppercase tracking-[0.11em] text-white/45">
              <span className="border border-white/10 bg-white/[0.025] px-2 py-3">
                <strong className="block font-display text-2xl text-frost">{counts.all}</strong>
                uploads
              </span>
              <span className="border border-white/10 bg-white/[0.025] px-2 py-3">
                <strong className="block font-display text-2xl text-frost">{counts.featured}</strong>
                featured
              </span>
              <span className="border border-white/10 bg-white/[0.025] px-2 py-3">
                <strong className="block font-display text-2xl text-frost">{counts.design}</strong>
                designs
              </span>
            </div>
          </div>
        </div>

        <div className="mb-7 flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`filter-chip shrink-0 ${activeFilter === option.value ? 'filter-chip-active' : ''}`}
              onClick={() => setActiveFilter(option.value)}
            >
              {option.label}
              <span className="ml-2 text-xs opacity-60">{counts[option.value]}</span>
            </button>
          ))}
        </div>

        {visibleItems.length ? (
          <div className={`grid gap-5 ${galleryItems.length ? 'lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]' : ''}`}>
            {spotlightItem && (
              <article className="manga-panel group min-h-[34rem] border-white/15 bg-black">
                <div className="relative h-full min-h-[34rem] overflow-hidden">
                  <button
                    type="button"
                    className="absolute inset-0 z-10"
                    onClick={() => setActiveItem(spotlightItem)}
                    aria-label={`Open ${spotlightItem.title}`}
                  />
                  {isVideoProject(spotlightItem) && spotlightItem.mediaUrl ? (
                    <video
                      className="absolute inset-0 h-full w-full object-cover opacity-85 transition duration-700 group-hover:scale-[1.02]"
                      poster={spotlightItem.thumbnailUrl}
                      preload="none"
                      muted
                      loop
                      playsInline
                      onMouseEnter={(event) => event.currentTarget.play().catch(() => undefined)}
                      onMouseLeave={(event) => {
                        event.currentTarget.pause();
                        event.currentTarget.currentTime = 0;
                      }}
                    >
                      <source src={spotlightItem.mediaUrl} />
                    </video>
                  ) : (
                    <img
                      className="absolute inset-0 h-full w-full bg-black object-cover opacity-85 transition duration-700 group-hover:scale-[1.02]"
                      src={spotlightItem.mediaUrl || spotlightItem.thumbnailUrl}
                      alt={spotlightItem.title}
                      loading="lazy"
                    />
                  )}
                  <span className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/10" />
                  <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-frost px-3 py-1 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-ink">
                    {spotlightItem.featured ? <Star size={13} fill="currentColor" /> : <Grid2X2 size={13} />}
                    Spotlight
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 z-20 p-5 sm:p-7">
                    <span className="meta-pill">
                      {isVideoProject(spotlightItem) ? <Play size={13} fill="currentColor" /> : <Images size={13} />}
                      {spotlightItem.type} / {spotlightItem.category || 'Portfolio'}
                    </span>
                    <span className="mt-4 block break-words font-display text-5xl font-bold uppercase leading-[0.88] text-frost sm:text-6xl">
                      {spotlightItem.title}
                    </span>
                    <span className="mt-4 line-clamp-3 block max-w-xl text-sm leading-7 text-white/65">
                      {spotlightItem.description}
                    </span>
                    <span className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <button className="btn-primary" type="button" onClick={() => setActiveItem(spotlightItem)}>
                        Quick preview
                      </button>
                      <Link
                        className="btn-secondary"
                        to={`/project/${spotlightItem.id}`}
                      >
                        Full project <ArrowRight size={15} />
                      </Link>
                    </span>
                  </div>
                </div>
              </article>
            )}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {galleryItems.map((item, index) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  index={index}
                  variant={getVariant(item)}
                  onOpen={setActiveItem}
                />
              ))}
            </div>
          </div>
        ) : <EmptyState />}
      </div>
      <ProjectLightbox item={activeItem} items={visibleItems} onChange={setActiveItem} onClose={() => setActiveItem(null)} />
    </section>
  );
};

export default FeaturedShowcase;
