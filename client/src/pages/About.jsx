import { Clapperboard, Gauge, Layers3, Palette, Scissors, ShieldCheck, WandSparkles } from 'lucide-react';

const stats = [
  { label: 'Editing focus', value: 'Retention' },
  { label: 'Design style', value: 'Cinematic' },
  { label: 'Delivery', value: 'Platform-ready' }
];

const sections = [
  { icon: Scissors, title: 'What I Do', text: 'Short-form reels, long-form edits, thumbnails, posters, logos, social designs, and polished campaign visuals.' },
  { icon: Palette, title: 'Tools I Use', text: 'Premiere Pro, After Effects, DaVinci Resolve, Photoshop, Illustrator, Audition, CapCut, and Lightroom.' },
  { icon: WandSparkles, title: 'Editing Style', text: 'Anime-inspired energy, sharp rhythm, clean typography, neon contrast, and cinematic visual hierarchy.' }
];

const About = () => (
  <main className="page-pad bg-ink">
    <section className="section-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="page-hero">
        <div className="absolute inset-0 bg-cinematic-sheen opacity-30" />
        <div className="absolute inset-0 bg-manga-lines opacity-10" />
        <p className="eyebrow">About</p>
        <h1 className="mt-4 font-display text-5xl font-black leading-none text-white md:text-7xl">
          A video editor and designer for fast-moving brands and creators.
        </h1>
        <p className="mt-6 text-base leading-8 text-white/60">
          This portfolio is built for a creative who can move across reels, long-form content, thumbnails, posters,
          branding, Photoshop compositing, and Illustrator layouts without losing the cinematic point of view.
        </p>
      </div>

      <div className="grid gap-4">
        {[
          { icon: Clapperboard, title: 'Narrative editing', text: 'Strong hooks, clean pacing, and edits shaped around viewer attention.' },
          { icon: Layers3, title: 'Design depth', text: 'Layered thumbnails, posters, logos, and social graphics that scan fast.' },
          { icon: Gauge, title: 'Performance-aware', text: 'Poster-first media, lazy loading, Cloudinary delivery, and optimized effects.' },
          { icon: ShieldCheck, title: 'Production-ready', text: 'Admin-only upload flows, JWT protection, server validation, and deployment notes.' }
        ].map((item) => (
          <article key={item.title} className="anime-surface rounded-lg p-6 transition duration-500 hover:-translate-y-1 hover:border-electric/30">
            <item.icon className="text-electric" size={22} />
            <h2 className="mt-4 font-display text-2xl font-semibold text-white">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-white/60">{item.text}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="section-shell mt-16 grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.label} className="manga-panel p-6">
          <p className="text-sm text-white/50">{stat.label}</p>
          <p className="mt-2 font-display text-3xl font-bold text-white">{stat.value}</p>
        </div>
      ))}
    </section>

    <section className="section-shell mt-6 grid gap-4 lg:grid-cols-3">
      {sections.map((section) => (
        <article key={section.title} className="anime-surface rounded-lg p-6">
          <section.icon className="text-hotpink" size={22} />
          <h2 className="mt-4 font-display text-2xl font-semibold text-white">{section.title}</h2>
          <p className="mt-3 text-sm leading-7 text-white/60">{section.text}</p>
        </article>
      ))}
    </section>
  </main>
);

export default About;
