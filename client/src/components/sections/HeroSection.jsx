import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, BriefcaseBusiness, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroSection = () => (
  <section className="relative isolate min-h-[92svh] overflow-hidden pt-28">
    <img
      src="/cinematic-editor-hero.png"
      alt="Cinematic editing studio with video timeline and design boards"
      className="absolute inset-0 -z-20 h-full w-full object-cover"
    />
    <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.88)_34%,rgba(5,5,5,0.46)_100%)]" />
    <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-ink to-transparent" />

    <div className="mx-auto flex min-h-[calc(92svh-7rem)] max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-4xl">
        <motion.p
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/75 backdrop-blur"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Play size={15} fill="currentColor" />
          Reels, YouTube edits, thumbnails, posters, branding
        </motion.p>
        <motion.h1
          className="mt-6 max-w-4xl font-display text-5xl font-black leading-[0.96] text-white sm:text-6xl lg:text-8xl"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08 }}
        >
          I Create Scroll-Stopping Reels, Cinematic Edits & Visual Designs
        </motion.h1>
        <motion.p
          className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.16 }}
        >
          Video editor and designer specializing in reels, YouTube edits, thumbnails, posters, branding, Photoshop,
          and Illustrator work.
        </motion.p>
        <motion.div
          className="mt-9 flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.24 }}
        >
          <Link className="btn-primary" to="/reels">
            <BriefcaseBusiness size={18} />
            View Work
          </Link>
          <Link className="btn-secondary" to="/contact">
            Hire Me
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </div>

    <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs uppercase tracking-[0.28em] text-white/50 md:flex">
      <ArrowDown size={14} />
      Scroll
    </div>
  </section>
);

export default HeroSection;
