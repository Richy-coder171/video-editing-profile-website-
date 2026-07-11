import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProjectLightbox from '../portfolio/ProjectLightbox.jsx';

gsap.registerPlugin(ScrollTrigger);

const ReelsHorizontal = ({ items }) => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [activeItem, setActiveItem] = useState(null);
  const reels = items.filter((item) => item.type === 'reel').slice(0, 6);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;

    if (!section || !track || window.matchMedia('(max-width: 1023px), (prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const getDistance = () => Math.max(0, track.scrollWidth - section.offsetWidth + 64);

      if (getDistance() <= 0) {
        return;
      }

      gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true
        }
      });
    }, section);

    return () => ctx.revert();
  }, [reels.length]);

  if (!reels.length) {
    return null;
  }

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-black py-16 sm:py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-electric/40 to-transparent" />
      <div className="section-shell">
        <p className="eyebrow">Vertical cuts / 01B</p>
        <h2 className="reveal-text section-title mt-3 max-w-4xl">
          Made to stop the thumb, then reward the watch.
        </h2>
      </div>

      <div
        ref={trackRef}
        className="mx-auto mt-12 grid max-w-7xl gap-5 px-4 sm:grid-cols-2 sm:px-6 lg:mx-0 lg:flex lg:w-max lg:max-w-none lg:px-[max(2rem,calc((100vw-80rem)/2))]"
      >
        {reels.map((item, index) => (
          <button
            key={item._id || item.id}
            className="manga-panel group relative aspect-[9/16] w-full shrink-0 p-2 text-left transition duration-500 hover:-translate-y-1 hover:border-electric/35 lg:w-[320px]"
            onClick={() => setActiveItem(item)}
          >
            <span className="absolute left-1/2 top-3 z-10 h-1 w-12 -translate-x-1/2 rounded-full bg-white/20" />
            <span className="relative block h-full overflow-hidden rounded-md">
              <img
                src={item.thumbnailUrl || '/cinematic-editor-hero.png'}
                alt={item.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
              <span className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent" />
            </span>
            <span className="absolute left-5 top-5 border border-white/20 bg-black/55 px-3 py-1 font-mono text-[0.6rem] text-acid backdrop-blur">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="absolute bottom-0 left-0 right-0 p-6">
              <span className="text-xs uppercase tracking-[0.24em] text-electric">{item.category}</span>
              <span className="mt-2 block font-display text-3xl font-bold uppercase leading-none text-white">{item.title}</span>
              <span className="mt-2 line-clamp-3 block text-sm leading-6 text-white/60">{item.description}</span>
            </span>
          </button>
        ))}
      </div>
      <ProjectLightbox item={activeItem} onClose={() => setActiveItem(null)} />
    </section>
  );
};

export default ReelsHorizontal;
