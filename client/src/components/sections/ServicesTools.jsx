import { BadgeCheck, Captions, Palette, RadioTower, Scissors, WandSparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const services = [
  { icon: Scissors, title: 'Short-form editing', text: 'Hooks, retention cuts, captions, transitions, pacing, and export versions.' },
  { icon: RadioTower, title: 'YouTube edits', text: 'Story shaping, b-roll, music rhythm, polish passes, thumbnails, and chapter flow.' },
  { icon: Palette, title: 'Design systems', text: 'Thumbnails, posters, social posts, logos, and brand visuals with strong hierarchy.' },
  { icon: WandSparkles, title: 'Motion polish', text: 'Clean title moves, lower thirds, kinetic type, overlays, and premium accents.' }
];

const tools = ['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Photoshop', 'Illustrator', 'Audition', 'CapCut', 'Lightroom'];

const ServicesTools = () => (
  <section className="section-pad bg-graphite">
    <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <div>
        <p className="eyebrow">Services</p>
        <h2 className="reveal-text mt-3 font-display text-4xl font-bold text-white md:text-6xl">
          Creative production for videos people actually finish.
        </h2>
        <p className="mt-6 text-sm leading-7 text-white/60">
          From raw footage to the final scroll-stopping output, every visual decision is tuned for attention, clarity,
          and brand memory.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {tools.map((tool) => (
            <span key={tool} className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-white/70">
              {tool}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {services.map((service, index) => (
          <motion.article
            key={service.title}
            className="rounded-lg border border-white/10 bg-white/[0.04] p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
          >
            <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-ink">
              <service.icon size={20} />
            </span>
            <h3 className="mt-5 font-display text-xl font-semibold text-white">{service.title}</h3>
            <p className="mt-3 text-sm leading-7 text-white/60">{service.text}</p>
          </motion.article>
        ))}
        <div className="rounded-lg border border-acid/30 bg-acid/10 p-6 text-acid">
          <BadgeCheck size={22} />
          <p className="mt-4 font-display text-xl font-semibold">Export-ready deliverables</p>
          <p className="mt-3 text-sm leading-7 text-white/60">
            Shorts, reels, thumbnails, posters, and campaign assets prepared for platform-specific delivery.
          </p>
        </div>
        <div className="rounded-lg border border-electric/30 bg-electric/10 p-6 text-electric">
          <Captions size={22} />
          <p className="mt-4 font-display text-xl font-semibold">Retention-first caption work</p>
          <p className="mt-3 text-sm leading-7 text-white/60">
            Caption styling, beat emphasis, motion cues, and readable layouts for mobile-first viewers.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default ServicesTools;
