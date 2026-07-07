import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';

const ProjectLightbox = ({ item, onClose }) => {
  const isVideo = item?.type === 'video' || item?.type === 'reel';

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[90] grid place-items-center bg-black/90 px-4 py-10 backdrop-blur-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-lg border border-white/10 bg-graphite"
            initial={{ y: 24, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 24, scale: 0.98 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-electric">{item.category}</p>
                <h2 className="mt-1 font-display text-2xl font-semibold text-white">{item.title}</h2>
              </div>
              <button className="icon-button" onClick={onClose} aria-label="Close project">
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-6 p-4 lg:grid-cols-[1.45fr_0.55fr]">
              <div className={`${item.type === 'reel' ? 'mx-auto aspect-[9/16] max-h-[72vh] w-full max-w-sm' : 'aspect-video'} overflow-hidden rounded-lg bg-black`}>
                {isVideo && item.mediaUrl ? (
                  <video className="h-full w-full object-contain" controls autoPlay muted poster={item.thumbnailUrl}>
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

              <aside className="space-y-5">
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
