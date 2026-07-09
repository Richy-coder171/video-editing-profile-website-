import { motion } from 'framer-motion';
import { Maximize2, Play, Sparkles } from 'lucide-react';
import { useRef } from 'react';
import { formatProjectDate } from '../../utils/date.js';

const aspectMap = {
  reel: 'aspect-[9/16]',
  video: 'aspect-video',
  design: 'aspect-[4/5]',
  square: 'aspect-square'
};

const MediaCard = ({ item, variant = 'video', onOpen, index = 0 }) => {
  const isVideo = item.type === 'video' || item.type === 'reel';
  const poster = item.thumbnailUrl || item.mediaUrl || '/cinematic-editor-hero.png';
  const cardRef = useRef(null);
  const isReel = variant === 'reel';
  const isDesign = variant === 'design';

  return (
    <motion.article
      ref={cardRef}
      className={`group relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.045] shadow-[0_18px_80px_rgba(0,0,0,0.26)] transition duration-500 hover:-translate-y-1 hover:border-white/20 ${
        isReel ? 'p-2' : ''
      }`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.05, 0.25) }}
    >
      <span className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition group-hover:opacity-100" />
      <button
        className={`relative block w-full overflow-hidden rounded-md ${aspectMap[variant] || aspectMap.video}`}
        onClick={() => onOpen?.(item)}
        aria-label={`Open ${item.title}`}
      >
        {isVideo && item.mediaUrl ? (
          <video
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            poster={poster}
            preload="none"
            muted
            loop
            playsInline
            onMouseEnter={(event) => event.currentTarget.play().catch(() => undefined)}
            onFocus={(event) => event.currentTarget.play().catch(() => undefined)}
            onMouseLeave={(event) => {
              event.currentTarget.pause();
              event.currentTarget.currentTime = 0;
            }}
            onBlur={(event) => {
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

        <span className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent opacity-85" />
        <span className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/60 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/80 backdrop-blur">
          {item.category}
        </span>
        <span className="absolute bottom-4 right-4 grid h-11 w-11 place-items-center rounded-full bg-white text-ink shadow-[0_12px_30px_rgba(0,0,0,0.28)] transition group-hover:scale-105">
          {isVideo ? <Play size={18} fill="currentColor" /> : <Maximize2 size={18} />}
        </span>
      </button>

      <div className={`${isReel ? 'px-2 pb-3 pt-5' : 'p-5'} space-y-4`}>
        <div>
          {item.projectDate && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-electric/80">
              {formatProjectDate(item.projectDate)}
            </p>
          )}
          <h3 className={`${isDesign ? 'text-xl' : 'text-lg'} font-display font-bold leading-tight text-white`}>
            {item.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/60">{item.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(item.tools || []).slice(0, 4).map((tool) => (
            <span
              key={tool}
              className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-white/70"
            >
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
