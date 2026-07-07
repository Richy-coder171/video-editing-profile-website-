import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import EmptyState from '../portfolio/EmptyState.jsx';
import ProjectLightbox from '../portfolio/ProjectLightbox.jsx';

const FeaturedShowcase = ({ items }) => {
  const [activeItem, setActiveItem] = useState(null);
  const featured = items.slice(0, 4);
  const sectionRef = useRef(null);

  return (
    <section ref={sectionRef} className="section-pad relative overflow-hidden bg-ink">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="section-shell">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Featured projects</p>
            <h2 className="reveal-text section-title mt-3 max-w-3xl">
              Edits and visuals built for attention, rhythm, and recall.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-white/60">
            A curated mix of vertical reels, long-form edits, thumbnails, posters, and brand visuals.
          </p>
        </div>

        {featured.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((item, index) => (
              <motion.button
                key={item._id || item.id}
                className={`group relative min-h-[340px] overflow-hidden rounded-lg border border-white/10 bg-white/5 text-left shadow-[0_22px_80px_rgba(0,0,0,0.28)] transition duration-500 hover:-translate-y-1 hover:border-white/20 ${
                  index === 0 ? 'sm:col-span-2 lg:col-span-2 lg:row-span-2 lg:min-h-[700px]' : ''
                }`}
                onClick={() => setActiveItem(item)}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
              >
                <img
                  src={item.thumbnailUrl || item.mediaUrl || '/cinematic-editor-hero.png'}
                  alt={item.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <span className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent" />
                <span className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white text-ink shadow-[0_12px_34px_rgba(0,0,0,0.28)] transition group-hover:rotate-12">
                  <ArrowUpRight size={19} />
                </span>
                <span className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/70 backdrop-blur">
                    {item.category || item.type}
                  </span>
                  <span className="mt-4 block font-display text-2xl font-bold leading-tight text-white">{item.title}</span>
                  <span className="mt-2 block text-sm leading-6 text-white/60">{item.description}</span>
                  <span className="mt-4 flex flex-wrap gap-2">
                    {(item.tools || []).slice(0, 3).map((tool) => (
                      <span key={tool} className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                        {tool}
                      </span>
                    ))}
                  </span>
                </span>
              </motion.button>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
      <ProjectLightbox item={activeItem} onClose={() => setActiveItem(null)} />
    </section>
  );
};

export default FeaturedShowcase;
