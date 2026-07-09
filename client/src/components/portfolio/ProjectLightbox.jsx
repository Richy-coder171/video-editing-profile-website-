import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';
import { formatProjectDate } from '../../utils/date.js';

const ProjectLightbox = ({ item, onClose }) => {
  const isVideo = item?.type === 'video' || item?.type === 'reel';

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[90] grid place-items-start overflow-y-auto bg-black/90 px-3 py-4 backdrop-blur-lg sm:place-items-center sm:px-4 sm:py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="anime-surface max-h-[92svh] w-full max-w-5xl overflow-y-auto rounded-lg bg-graphite"
            initial={{ y: 24, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 24, scale: 0.98 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 p-4 sm:p-5">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.22em] text-electric sm:tracking-[0.26em]">
                  {item.category}
                  {item.projectDate ? ` / ${formatProjectDate(item.projectDate)}` : ''}
                </p>
                <h2 className="mt-1 break-words font-display text-2xl font-semibold text-white sm:text-3xl">{item.title}</h2>
              </div>
              <button className="icon-button" onClick={onClose} aria-label="Close project">
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-5 p-3 sm:p-4 lg:grid-cols-[1.45fr_0.55fr]">
              <div className={`${item.type === 'reel' ? 'mx-auto aspect-[9/16] max-h-[72vh] w-full max-w-sm' : 'aspect-video'} overflow-hidden rounded-lg border border-white/10 bg-black`}>
                {isVideo && item.mediaUrl ? (
                  <video className="h-full w-full object-contain" controls autoPlay muted playsInline preload="metadata" poster={item.thumbnailUrl}>
                    <source src={item.mediaUrl} />
                  </video>
                ) : (
                  <img
                    src={item.mediaUrl || item.thumbnailUrl || '/cinematic-editor-hero.png'}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <aside className="space-y-5 rounded-lg border border-white/10 bg-black/25 p-4">
                <p className="text-sm leading-7 text-white/70">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                  {(item.tools || []).map((tool) => (
                    <span key={tool} className="rounded-full border border-white/10 px-3 py-1 text-sm text-white/70">
                      {tool}
                    </span>
                  ))}
                </div>
                {item.mediaUrl && (
                  <a className="btn-primary inline-flex" href={item.mediaUrl} target="_blank" rel="noreferrer">
                    <ExternalLink size={17} />
                    Open media
                  </a>
                )}
              </aside>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectLightbox;
