import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, Aperture, Film, Images, Play, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const heroStats = [
  { label: 'Vertical edits', value: '9:16' },
  { label: 'Long-form rhythm', value: '16:9' },
  { label: 'Design polish', value: 'PSD + AI' }
];

const HeroSection = () => (
  <section className="relative isolate min-h-[90svh] overflow-hidden pt-24 sm:pt-28">
    <img
      src="/cinematic-editor-hero.png"
      alt="Cinematic editing studio with video timeline and design boards"
      fetchPriority="high"
      className="absolute inset-0 -z-30 h-full w-full object-cover"
    />
    <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.93)_38%,rgba(5,5,5,0.44)_100%)]" />
    <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(5,5,5,0.2)_0%,rgba(5,5,5,0.08)_46%,#050505_100%)]" />
    <div className="absolute inset-x-0 top-24 -z-10 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
    <div className="absolute bottom-0 right-0 -z-10 hidden h-48 w-2/3 bg-[linear-gradient(90deg,transparent,rgba(51,214,255,0.12),rgba(255,54,94,0.1),transparent)] lg:block" />

    <div className="section-shell flex min-h-[calc(90svh-6rem)] items-center py-12">
      <div className="max-w-5xl">
        <motion.p
          className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl sm:text-sm"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Play size={15} fill="currentColor" />
          Anime energy for reels, edits, thumbnails, posters
        </motion.p>
        <motion.h1
          className="mt-6 max-w-5xl font-display text-5xl font-black leading-[0.9] text-white sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08 }}
        >
          I Edit Videos That Feel Like Anime Openings
        </motion.h1>
        <motion.p
          className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.16 }}
        >
          Reels, cinematic edits, thumbnails, posters, Photoshop, Illustrator, and visual storytelling.
        </motion.p>
        <motion.div
          className="mt-9 flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.24 }}
        >
          <Link className="btn-primary" to="/reels">
            <Play size={18} fill="currentColor" />
            Watch Reels
          </Link>
          <Link className="btn-secondary" to="/designs">
            <Images size={18} />
            View Designs
          </Link>
          <Link className="btn-secondary" to="/contact">
            Hire Me
            <ArrowRight size={18} />
          </Link>
        </motion.div>

        <motion.div
          className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-3"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.32 }}
        >
          {heroStats.map((stat) => (
            <div key={stat.label} className="border-l border-white/20 pl-4">
              <p className="font-display text-2xl font-bold text-white">{stat.value}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/50">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>

    <motion.div
      className="absolute bottom-8 right-4 hidden w-[min(37rem,42vw)] rounded-lg border border-white/10 bg-black/30 p-4 shadow-[0_20px_70px_rgba(0,0,0,0.36)] backdrop-blur-xl lg:block"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.42 }}
    >
      <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-white/50">
        <span className="inline-flex items-center gap-2">
          <Film size={14} />
          Edit timeline
        </span>
        <span className="inline-flex items-center gap-2 text-electric">
          <Aperture size={14} />
          color pass
        </span>
      </div>
      <div className="grid grid-cols-12 gap-2">
        {['bg-electric', 'bg-white/25', 'bg-ember', 'bg-acid', 'bg-white/20', 'bg-electric/60'].map((color, index) => (
          <span
            key={`${color}-${index}`}
            className={`h-9 rounded-md ${color}`}
            style={{ gridColumn: `span ${index % 2 === 0 ? 3 : 2}` }}
          />
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm text-white/60">
        <Sparkles size={16} className="text-acid" />
        Hook, pacing, captions, grade, sound, export.
      </div>
    </motion.div>

    <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs uppercase tracking-[0.28em] text-white/50 md:flex">
      <ArrowDown size={14} />
      Scroll
    </div>
  </section>
);

export default HeroSection;
