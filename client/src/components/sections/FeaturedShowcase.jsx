import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import ProjectLightbox from '../portfolio/ProjectLightbox.jsx';

const FeaturedShowcase = ({ items }) => {
  const [activeItem, setActiveItem] = useState(null);
  const featured = items.slice(0, 4);
  const sectionRef = useRef(null);

  return (
    <section ref={sectionRef} className="section-pad bg-ink">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Featured projects</p>
            <h2 className="reveal-text mt-3 max-w-3xl font-display text-4xl font-bold text-white md:text-6xl">
              Edits and visuals built for attention, rhythm, and recall.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-white/60">
            A curated mix of vertical reels, long-form edits, thumbnails, posters, and brand visuals.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          {featured.map((item, index) => (
            <motion.button
              key={item._id || item.id}
              className={`group relative min-h-[360px] overflow-hidden rounded-lg border border-white/10 bg-white/5 text-left ${
                index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''
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
              <span className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white text-ink">
                <ArrowUpRight size={19} />
              </span>
              <span className="absolute bottom-0 left-0 right-0 p-5">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">{item.category}</span>
                <span className="mt-4 block font-display text-2xl font-semibold text-white">{item.title}</span>
                <span className="mt-2 block text-sm leading-6 text-white/60">{item.description}</span>
              </span>
            </motion.button>
          ))}
        </div>
      </div>
      <ProjectLightbox item={activeItem} onClose={() => setActiveItem(null)} />
    </section>
  );
};

export default FeaturedShowcase;
