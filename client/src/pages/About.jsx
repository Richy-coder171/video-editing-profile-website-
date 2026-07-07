import { Clapperboard, Gauge, Layers3, ShieldCheck } from 'lucide-react';

const stats = [
  { label: 'Editing focus', value: 'Retention' },
  { label: 'Design style', value: 'Cinematic' },
  { label: 'Delivery', value: 'Platform-ready' }
];

const About = () => (
  <main className="page-pad bg-ink">
    <section className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <div>
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
          <article key={item.title} className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
            <item.icon className="text-electric" size={22} />
            <h2 className="mt-4 font-display text-2xl font-semibold text-white">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-white/60">{item.text}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="mx-auto mt-16 grid max-w-7xl gap-4 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-lg border border-white/10 bg-black p-6">
          <p className="text-sm text-white/50">{stat.label}</p>
          <p className="mt-2 font-display text-3xl font-bold text-white">{stat.value}</p>
        </div>
      ))}
    </section>
  </main>
);

export default About;
