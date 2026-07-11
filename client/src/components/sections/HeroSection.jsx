import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, Play, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';

const timelineClips = [
  { label: 'HOOK', width: '18%', color: 'bg-ember' },
  { label: 'BUILD', width: '25%', color: 'bg-electric' },
  { label: 'DROP', width: '14%', color: 'bg-acid text-ink' },
  { label: 'PAYOFF', width: '31%', color: 'bg-violet' }
];

const HeroSection = () => (
  <section className="relative isolate min-h-[100svh] overflow-hidden border-b border-white/10 pt-[4.5rem] sm:pt-20">
    <div className="absolute inset-0 -z-30 bg-ink" />
    <img
      src="/cinematic-editor-hero.png"
      alt="Cinematic video edit displayed across studio monitors"
      fetchPriority="high"
      className="absolute inset-y-0 right-0 -z-20 h-full w-full object-cover object-[68%_center] opacity-40 lg:w-[62%] lg:opacity-75"
    />
    <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#07090b_0%,#07090b_42%,rgba(7,9,11,0.85)_62%,rgba(7,9,11,0.25)_100%)]" />
    <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(7,9,11,0.12)_0%,rgba(7,9,11,0.2)_62%,#07090b_100%)]" />

    <div className="section-shell flex min-h-[calc(100svh-4.5rem)] flex-col justify-between py-8 sm:min-h-[calc(100svh-5rem)] sm:py-10 lg:py-12">
      <div className="flex items-center justify-between border-b border-white/15 pb-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-white/45">
        <span>Editor / Motion designer</span>
        <span className="hidden sm:block">Sequence 01 · Main title</span>
        <span className="text-acid">Rec ●</span>
      </div>

      <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.72fr)]">
        <div>
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            Cuts with pulse. Frames with purpose.
          </motion.p>
          <motion.h1
            className="mt-5 max-w-5xl font-display text-[clamp(4.4rem,14.3vw,10.8rem)] font-black uppercase leading-[0.75] tracking-[-0.045em] text-frost"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.08, ease: [0.2, 0.8, 0.2, 1] }}
          >
            I edit
            <span className="block text-electric">videos</span>
            <span className="block text-transparent [-webkit-text-stroke:1.5px_#f2eee6]">like openings.</span>
          </motion.h1>
          <motion.div
            className="mt-7 grid max-w-3xl gap-6 border-l-2 border-acid pl-5 sm:grid-cols-[1fr_auto] sm:items-end"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2 }}
          >
            <p className="max-w-xl text-sm leading-7 text-white/65 sm:text-base">
              Reels, cinematic edits, thumbnails, posters, and visual systems shaped around rhythm—not presets.
            </p>
            <p className="font-mono text-[0.62rem] uppercase leading-5 tracking-[0.16em] text-white/40">
              Premiere / AE<br />Resolve / PS / AI
            </p>
          </motion.div>
          <motion.div
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.28 }}
          >
            <Link className="btn-primary w-full sm:w-auto" to="/reels">
              <Play size={16} fill="currentColor" />
              Watch the cuts
            </Link>
            <Link className="btn-secondary w-full sm:w-auto" to="/contact">
              Start a project
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="hidden self-end lg:block"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
        >
          <div className="border border-white/15 bg-black/60 p-2 shadow-panel backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-white/10 px-2 py-2 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-white/45">
              <span>Program monitor</span>
              <span className="text-white/75">00:00:12:18</span>
            </div>
            <div className="relative aspect-video overflow-hidden bg-black">
              <img src="/cinematic-editor-hero.png" alt="" className="h-full w-full object-cover" />
              <span className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
              <span className="absolute bottom-3 left-3 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-white/70">Preview / Color pass</span>
            </div>
            <div className="flex items-center justify-between px-2 py-2 font-mono text-[0.6rem] text-white/40">
              <span>1/2</span>
              <Play size={12} fill="currentColor" className="text-frost" />
              <Volume2 size={12} />
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="relative border-y border-white/15 bg-black/40 px-3 py-3 backdrop-blur-sm sm:px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.38 }}
      >
        <div className="mb-2 flex justify-between font-mono text-[0.55rem] uppercase tracking-[0.12em] text-white/35">
          <span>V1 · Story rhythm</span>
          <span>00:00:18:24</span>
        </div>
        <div className="timecode-grid relative flex h-9 gap-1 overflow-hidden border-y border-white/10 py-1">
          {timelineClips.map((clip) => (
            <span
              key={clip.label}
              className={`${clip.color} flex items-center overflow-hidden px-2 font-mono text-[0.5rem] font-semibold tracking-[0.12em] text-white/85`}
              style={{ width: clip.width }}
            >
              {clip.label}
            </span>
          ))}
          <span className="timeline-playhead absolute inset-y-0 left-0 z-10 w-px bg-frost shadow-[0_0_9px_rgba(242,238,230,0.9)]">
            <span className="absolute -top-1.5 -left-[3px] h-2 w-2 rotate-45 bg-frost" />
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between font-mono text-[0.55rem] uppercase tracking-[0.12em] text-white/35">
          <span>Hook → build → impact → payoff</span>
          <span className="hidden items-center gap-2 sm:flex"><ArrowDown size={11} /> Scroll for selected work</span>
        </div>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
