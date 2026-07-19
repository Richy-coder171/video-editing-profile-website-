import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatProjectDate } from '../../utils/date.js';
import { isVideoProject } from '../../utils/portfolio.js';

const ProjectLightbox = ({ item, items = [], onChange, onClose }) => {
  const currentIndex = item ? items.findIndex((entry) => entry.id === item.id) : -1;
  const canNavigate = items.length > 1 && currentIndex >= 0;

  const move = (direction) => {
    if (!canNavigate) return;
    const nextIndex = (currentIndex + direction + items.length) % items.length;
    onChange?.(items[nextIndex]);
  };

  useEffect(() => {
    if (!item) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
      if (event.key === 'ArrowLeft') move(-1);
      if (event.key === 'ArrowRight') move(1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  const isVideo = isVideoProject(item);
  const mediaHref = item?.mediaUrl || item?.thumbnailUrl;
  const projectDateLabel = formatProjectDate(item?.projectDate || item?.createdAt);
  const quickFacts = item ? [
    ['Type', item.type],
    ['Category', item.category],
    ['Date', projectDateLabel],
    ['Tools', item.tools?.length ? `${item.tools.length} listed` : '']
  ].filter(([, value]) => value) : [];

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[90] overflow-y-auto bg-black/95 p-3 backdrop-blur-xl sm:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
        >
          <motion.div
            className="mx-auto min-h-[calc(100svh-1.5rem)] w-full max-w-7xl border border-white/15 bg-graphite sm:min-h-0"
            initial={{ y: 20, scale: 0.99 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 20, scale: 0.99 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/10 p-3 sm:p-4">
              <p className="min-w-0 truncate font-mono text-[0.62rem] uppercase tracking-[0.13em] text-white/50">
                {item.type} / {item.category || 'Portfolio'}
              </p>
              <div className="flex items-center gap-2">
                {canNavigate && (
                  <>
                    <button className="icon-button" onClick={() => move(-1)} aria-label="Previous project"><ArrowLeft size={18} /></button>
                    <span className="hidden font-mono text-[0.6rem] text-white/35 sm:inline">{currentIndex + 1} / {items.length}</span>
                    <button className="icon-button" onClick={() => move(1)} aria-label="Next project"><ArrowRight size={18} /></button>
                  </>
                )}
                <button className="icon-button" onClick={onClose} aria-label="Close project"><X size={20} /></button>
              </div>
            </div>

            <div className="grid lg:grid-cols-[minmax(0,1.45fr)_minmax(20rem,0.55fr)]">
              <div className="grid min-h-[42svh] place-items-center bg-black p-2 sm:p-4 lg:min-h-[72svh]">
                {isVideo && item.mediaUrl ? (
                  <video
                    key={item.id}
                    className={`max-h-[76svh] w-full object-contain ${item.type === 'reel' ? 'max-w-md' : ''}`}
                    controls
                    muted
                    playsInline
                    preload="metadata"
                    poster={item.thumbnailUrl}
                  >
                    <source src={item.mediaUrl} />
                  </video>
                ) : (
                  <img
                    key={item.id}
                    src={item.mediaUrl || item.thumbnailUrl}
                    alt={item.title}
                    className="max-h-[76svh] h-auto w-auto max-w-full object-contain"
                  />
                )}
              </div>

              <aside className="flex flex-col border-t border-white/10 p-5 sm:p-7 lg:border-l lg:border-t-0">
                <div className="flex-1">
                  <p className="eyebrow">Project preview</p>
                  <h2 className="mt-3 font-display text-4xl font-bold uppercase leading-[0.9] text-frost sm:text-5xl">{item.title}</h2>
                  {projectDateLabel && <p className="mt-4 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-electric">{projectDateLabel}</p>}
                  <p className="mt-5 text-sm leading-7 text-white/65">{item.description}</p>
                  {quickFacts.length > 0 && (
                    <dl className="mt-5 grid grid-cols-2 gap-2">
                      {quickFacts.map(([label, value]) => (
                        <div key={label} className="rounded-md border border-white/10 bg-black/25 p-3">
                          <dt className="font-mono text-[0.56rem] uppercase tracking-[0.12em] text-white/35">{label}</dt>
                          <dd className="mt-1 truncate text-sm font-semibold text-white/75">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {(item.tools || []).map((tool) => <span key={tool} className="meta-pill">{tool}</span>)}
                  </div>
                  {(item.externalUrl || mediaHref) && (
                    <div className="mt-5 flex flex-wrap gap-3 text-sm">
                      {item.externalUrl && (
                        <a className="inline-flex items-center gap-2 text-electric hover:text-white" href={item.externalUrl} target="_blank" rel="noreferrer">
                          <ExternalLink size={15} /> View published work
                        </a>
                      )}
                      {mediaHref && (
                        <a className="inline-flex items-center gap-2 text-electric hover:text-white" href={mediaHref} target="_blank" rel="noreferrer">
                          <ExternalLink size={15} /> Open media
                        </a>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="font-display text-2xl font-semibold uppercase text-white">Like this style?</p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    <Link className="btn-primary" to="/contact" onClick={onClose}>Hire me</Link>
                    <Link className="btn-secondary" to={`/project/${item.id}`} onClick={onClose}>View full project</Link>
                  </div>
                  <button className="mt-3 w-full py-2 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-white/45 hover:text-white" onClick={onClose}>View more work</button>
                </div>
              </aside>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectLightbox;
