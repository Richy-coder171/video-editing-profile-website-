import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { isVideoProject, sortPortfolioItems } from '../../utils/portfolio.js';

const FeaturedShowreel = ({ items }) => {
  const videoRef = useRef(null);
  const [started, setStarted] = useState(false);
  const featuredProject = sortPortfolioItems(items).find((item) => item.featured && isVideoProject(item));

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
          <div className="grid border border-white/15 bg-graphite lg:grid-cols-[minmax(0,1.5fr)_minmax(20rem,0.5fr)]">
            <div className={`relative grid place-items-center bg-black ${featuredProject.type === 'reel' ? 'min-h-[65svh]' : 'aspect-video'}`}>
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
            </div>
            <div className="flex flex-col justify-between border-t border-white/10 p-6 sm:p-8 lg:border-l lg:border-t-0">
              <div>
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.13em] text-acid">{featuredProject.type} / {featuredProject.category || 'Featured'}</p>
                <h3 className="mt-4 font-display text-5xl font-bold uppercase leading-[0.88] text-frost">{featuredProject.title}</h3>
                <p className="mt-5 text-sm leading-7 text-white/60">{featuredProject.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">{(featuredProject.tools || []).map((tool) => <span className="meta-pill" key={tool}>{tool}</span>)}</div>
              </div>
              <div className="mt-8 grid gap-3">
                <Link className="btn-primary" to={`/project/${featuredProject.id}`}>View full project <ArrowRight size={16} /></Link>
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
