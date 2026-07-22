import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Play, Sparkles } from 'lucide-react';
import { formatProjectDate } from '../../utils/date.js';
import { isVideoProject, sortPortfolioItems } from '../../utils/portfolio.js';

const FeaturedShowreel = ({ items }) => {
  const videoRef = useRef(null);
  const [started, setStarted] = useState(false);
  const sortedVideos = sortPortfolioItems(items).filter((item) => isVideoProject(item) && item.featured);
  const featuredProject = sortedVideos[0];

  const startPlayback = () => {
    videoRef.current?.play().catch(() => undefined);
    setStarted(true);
  };

  return (
    <section className="section-pad border-b border-white/10 bg-black">
      <div className="section-shell">
        <div className="mb-8 flex flex-col gap-4 border-b border-white/15 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Featured showreel / 01</p>
            <h2 className="section-title mt-3">Start with the strongest cut.</h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-white/55">One selected project, shown at a size where pacing, sound, and finish can actually be judged.</p>
        </div>

        {featuredProject ? (
          <div className="grid overflow-hidden border border-white/15 bg-graphite shadow-[0_34px_110px_rgba(0,0,0,0.45)] lg:grid-cols-[minmax(0,1.48fr)_minmax(20rem,0.52fr)]">
            <div className={`relative grid place-items-center bg-black ${featuredProject.type === 'reel' ? 'min-h-[65svh]' : 'aspect-video'}`}>
              <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(104,167,255,0.12),transparent_22%,transparent_78%,rgba(255,176,0,0.08))]" />
              <video
                ref={videoRef}
                className={`h-full w-full object-contain ${featuredProject.type === 'reel' ? 'max-w-md' : ''}`}
                controls={started}
                muted
                playsInline
                preload="metadata"
                poster={featuredProject.thumbnailUrl}
                onPlay={() => setStarted(true)}
              >
                <source src={featuredProject.mediaUrl} />
              </video>
              {!started && (
                <button className="absolute inset-0 grid place-items-center bg-black/20 transition hover:bg-black/10" onClick={startPlayback} aria-label={`Play ${featuredProject.title}`}>
                  <span className="grid h-20 w-20 place-items-center rounded-full bg-frost text-ink shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition hover:scale-105 hover:bg-acid">
                    <Play size={28} fill="currentColor" />
                  </span>
                </button>
              )}
              <div className="pointer-events-none absolute bottom-4 left-4 z-20 hidden max-w-xs border border-white/15 bg-black/55 p-3 backdrop-blur md:block">
                <p className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-white/45">Preview mode</p>
                <p className="mt-1 text-sm leading-6 text-white/70">Muted playback. Open the full project for notes, tools, and delivery context.</p>
              </div>
            </div>
            <div className="flex flex-col justify-between border-t border-white/10 p-6 sm:p-8 lg:border-l lg:border-t-0">
              <div>
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.13em] text-acid">
                  Featured pick / {featuredProject.type}
                </p>
                <h3 className="mt-4 break-words font-display text-5xl font-bold uppercase leading-[0.88] text-frost">{featuredProject.title}</h3>
                <div className="mt-5 grid gap-3 border-y border-white/10 py-4 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-white/45 sm:grid-cols-2">
                  <span>{featuredProject.category || 'Portfolio'}</span>
                  {(featuredProject.projectDate || featuredProject.createdAt) && (
                    <span className="inline-flex items-center gap-2 text-electric">
                      <CalendarDays size={13} />
                      {formatProjectDate(featuredProject.projectDate || featuredProject.createdAt)}
                    </span>
                  )}
                </div>
                <p className="mt-5 text-sm leading-7 text-white/60">{featuredProject.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {(featuredProject.tools || []).map((tool) => (
                    <span className="meta-pill" key={tool}>
                      <Sparkles size={12} />
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-8 grid gap-3">
                <Link className="btn-primary" to={`/project/${featuredProject.id}`}>Watch project <ArrowRight size={16} /></Link>
                <Link className="btn-secondary" to="/contact">Hire me</Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="border border-dashed border-white/20 bg-white/[0.025] p-10 text-center">
            <p className="font-display text-3xl font-semibold uppercase text-frost">No featured work uploaded yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedShowreel;
