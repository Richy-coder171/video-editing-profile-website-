import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import EmptyState from '../portfolio/EmptyState.jsx';
import ProjectLightbox from '../portfolio/ProjectLightbox.jsx';
import { formatProjectDate } from '../../utils/date.js';

const FeaturedShowcase = ({ items }) => {
  const [activeItem, setActiveItem] = useState(null);
  const featured = items.slice(0, 4);
  const sectionRef = useRef(null);

  return (
    <section ref={sectionRef} className="section-pad relative overflow-hidden bg-ink">
      <div className="section-shell">
        <div className="mb-10 grid gap-5 border-b border-white/15 pb-7 md:grid-cols-[1fr_0.42fr] md:items-end">
          <div>
            <p className="eyebrow">Selected timeline / 01</p>
            <h2 className="reveal-text section-title mt-3 max-w-3xl">
              Work that earns the next frame.
            </h2>
          </div>
          <p className="max-w-md border-l border-white/15 pl-4 text-sm leading-7 text-white/55">
            A live selection of uploaded edits and visuals. Open a frame to see the full piece, tools, and project notes.
          </p>
        </div>

        {featured.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((item, index) => (
              <motion.button
                key={item._id || item.id}
                className={`manga-panel group relative min-h-[340px] text-left transition duration-500 hover:-translate-y-1 hover:border-electric/45 ${
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
                <span className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />
                <span className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent" />
                <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center border border-white/20 bg-black/55 text-white backdrop-blur transition group-hover:border-acid group-hover:bg-acid group-hover:text-ink">
                  <ArrowUpRight size={19} />
                </span>
                <span className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="meta-pill">
                    {item.category || item.type}
                  </span>
                  {item.projectDate && (
                    <span className="mt-3 block text-xs font-semibold uppercase tracking-[0.18em] text-electric/80">
                      {formatProjectDate(item.projectDate)}
                    </span>
                  )}
                  <span className="mt-4 block font-display text-3xl font-bold uppercase leading-[0.95] text-white">{item.title}</span>
                  <span className="mt-2 line-clamp-3 block text-sm leading-6 text-white/60">{item.description}</span>
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
