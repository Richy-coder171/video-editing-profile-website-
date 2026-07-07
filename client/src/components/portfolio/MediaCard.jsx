import { motion } from 'framer-motion';
import { Maximize2, Play, Sparkles } from 'lucide-react';

const aspectMap = {
  reel: 'aspect-[9/16]',
  video: 'aspect-video',
  design: 'aspect-[4/5]',
  square: 'aspect-square'
};

const MediaCard = ({ item, variant = 'video', onOpen, index = 0 }) => {
  const isVideo = item.type === 'video' || item.type === 'reel';
  const poster = item.thumbnailUrl || item.mediaUrl || '/cinematic-editor-hero.png';

  return (
    <motion.article
      className="group overflow-hidden rounded-lg border border-white/10 bg-white/[0.045] shadow-glow"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.05, 0.25) }}
    >
      <button
        className={`relative block w-full overflow-hidden ${aspectMap[variant] || aspectMap.video}`}
        onClick={() => onOpen?.(item)}
        aria-label={`Open ${item.title}`}
      >
        {isVideo && item.mediaUrl ? (
          <video
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            poster={poster}
            preload="metadata"
            muted
            loop
            playsInline
            onMouseEnter={(event) => event.currentTarget.play().catch(() => undefined)}
            onMouseLeave={(event) => {
              event.currentTarget.pause();
              event.currentTarget.currentTime = 0;
            }}
          >
            <source src={item.mediaUrl} />
          </video>
        ) : (
          <img
            src={poster}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        )}

        <span className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-75" />
        <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs text-white/80 backdrop-blur">
          {item.category}
        </span>
        <span className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-white text-ink transition group-hover:scale-105">
          {isVideo ? <Play size={18} fill="currentColor" /> : <Maximize2 size={18} />}
        </span>
      </button>

      <div className="space-y-4 p-5">
        <div>
          <h3 className="font-display text-lg font-semibold text-white">{item.title}</h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/60">{item.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(item.tools || []).slice(0, 4).map((tool) => (
            <span key={tool} className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
              <Sparkles size={12} />
              {tool}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
};

export default MediaCard;
