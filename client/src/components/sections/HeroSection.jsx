import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, Aperture, Film, Images, Play, Sparkles, WandSparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const heroStats = [
  { label: 'Vertical edits', value: '9:16' },
  { label: 'Long-form rhythm', value: '16:9' },
  { label: 'Design polish', value: 'PSD + AI' }
];

const HeroSection = () => (
  <section className="relative isolate min-h-[90svh] overflow-hidden pt-20 sm:pt-24">
    <img
      src="/cinematic-editor-hero.png"
      alt="Cinematic editing studio with video timeline and design boards"
      fetchPriority="high"
      className="absolute inset-0 -z-30 h-full w-full object-cover opacity-80"
    />
    <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.96)_42%,rgba(5,5,5,0.58)_100%)]" />
    <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(5,5,5,0.1)_0%,rgba(5,5,5,0.24)_55%,#050505_100%)]" />
    <div className="absolute inset-0 -z-10 bg-manga-lines opacity-[0.08]" />
    <div className="absolute inset-x-0 top-24 -z-10 h-px bg-gradient-to-r from-transparent via-electric/50 to-hotpink/30" />
    <div className="absolute bottom-0 right-0 -z-10 hidden h-56 w-2/3 skew-x-[-18deg] bg-cinematic-sheen opacity-90 blur-2xl lg:block" />
    <div className="absolute right-[-8rem] top-28 -z-10 hidden h-96 w-[34rem] rotate-12 border border-electric/20 bg-electric/5 lg:block" />
    <div className="absolute bottom-20 left-[-9rem] -z-10 hidden h-72 w-[30rem] -rotate-12 border border-hotpink/20 bg-hotpink/5 lg:block" />

    <div className="section-shell grid min-h-[calc(90svh-5rem)] items-center gap-10 py-10 sm:py-12 lg:grid-cols-[1fr_0.72fr]">
      <div className="max-w-5xl">
        <motion.p
          className="inline-flex max-w-full items-center gap-2 rounded-full border border-electric/20 bg-black/45 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/75 shadow-glow backdrop-blur-xl sm:text-sm"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Play size={15} fill="currentColor" />
          Premium anime-style editing and design
        </motion.p>
        <motion.h1
          className="mt-6 max-w-5xl font-display text-[clamp(2.65rem,11vw,7.3rem)] font-black leading-[0.92] text-white"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08 }}
        >
          I Edit Videos That Feel Like <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric via-hotpink to-ember">Anime Openings</span>
        </motion.h1>
        <motion.p
          className="mt-6 max-w-2xl text-base leading-8 text-white/72 sm:text-lg"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.16 }}
        >
          Reels, cinematic edits, thumbnails, posters, Photoshop, Illustrator, and visual storytelling.
        </motion.p>
        <motion.div
          className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.24 }}
        >
          <Link className="btn-primary w-full sm:w-auto" to="/reels">
            <Play size={18} fill="currentColor" />
            Watch Reels
          </Link>
          <Link className="btn-secondary w-full sm:w-auto" to="/designs">
            <Images size={18} />
            View Designs
          </Link>
          <Link className="btn-secondary w-full sm:w-auto" to="/contact">
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
            <div key={stat.label} className="anime-surface rounded-lg px-4 py-4">
              <p className="font-display text-2xl font-bold text-white">{stat.value}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/50">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        className="relative hidden min-h-[34rem] lg:block"
        initial={{ opacity: 0, x: 28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.85, delay: 0.28 }}
      >
        <div className="manga-panel absolute right-4 top-0 aspect-[4/5] w-[68%] rotate-3 rounded-lg p-2">
          <img src="/cinematic-editor-hero.png" alt="" className="h-full w-full rounded-md object-cover" />
          <div className="absolute inset-2 rounded-md bg-gradient-to-t from-black via-black/25 to-transparent" />
          <span className="meta-pill absolute left-5 top-5">Color grade</span>
        </div>
        <div className="manga-panel absolute bottom-10 left-0 aspect-[9/12] w-[47%] -rotate-6 rounded-lg p-2">
          <div className="grid h-full rounded-md bg-black p-3">
            <div className="space-y-2 self-end">
              <WandSparkles className="text-hotpink" size={24} />
              <p className="font-display text-2xl font-bold leading-tight text-white">Hook first. Impact second.</p>
              <p className="text-sm leading-6 text-white/55">Cuts, speed ramps, captions, grade, sound.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>

    <motion.div
      className="absolute bottom-8 right-4 hidden w-[min(37rem,42vw)] rounded-lg border border-white/10 bg-black/40 p-4 shadow-panel backdrop-blur-xl lg:block"
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
