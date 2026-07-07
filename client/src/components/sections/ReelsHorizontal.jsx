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

    if (!section || !track || window.matchMedia('(max-width: 1023px)').matches) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const distance = Math.max(0, track.scrollWidth - section.offsetWidth + 64);

      gsap.to(track, {
        x: -distance,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance}`,
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
    <section ref={sectionRef} className="relative overflow-hidden bg-black py-20 sm:py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-electric/40 to-transparent" />
      <div className="section-shell">
        <p className="eyebrow">Vertical reels</p>
        <h2 className="reveal-text section-title mt-3 max-w-4xl">
          A swipe-styled reel wall with agency-grade scroll motion.
        </h2>
      </div>

      <div
        ref={trackRef}
        className="mx-auto mt-12 grid max-w-7xl gap-5 px-4 sm:grid-cols-2 sm:px-6 lg:mx-0 lg:flex lg:w-max lg:max-w-none lg:px-[max(2rem,calc((100vw-80rem)/2))]"
      >
        {reels.map((item, index) => (
          <button
            key={item._id || item.id}
            className="group relative aspect-[9/16] w-full shrink-0 overflow-hidden rounded-lg border border-white/10 bg-graphite p-2 text-left shadow-[0_24px_80px_rgba(0,0,0,0.34)] transition duration-500 hover:-translate-y-1 hover:border-white/25 lg:w-[320px]"
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
            <span className="absolute left-5 top-5 rounded-full bg-white px-3 py-1 text-xs font-bold text-ink shadow-[0_10px_28px_rgba(0,0,0,0.28)]">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="absolute bottom-0 left-0 right-0 p-6">
              <span className="text-xs uppercase tracking-[0.24em] text-electric">{item.category}</span>
              <span className="mt-2 block font-display text-2xl font-bold leading-tight text-white">{item.title}</span>
              <span className="mt-2 block text-sm leading-6 text-white/60">{item.description}</span>
            </span>
          </button>
        ))}
      </div>
      <ProjectLightbox item={activeItem} onClose={() => setActiveItem(null)} />
    </section>
  );
};

export default ReelsHorizontal;
