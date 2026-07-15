import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ExternalLink, Maximize2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import EmptyState from '../components/portfolio/EmptyState.jsx';
import PortfolioGrid from '../components/portfolio/PortfolioGrid.jsx';
import ProjectLightbox from '../components/portfolio/ProjectLightbox.jsx';
import LazyPage3DAccent from '../components/three/LazyPage3DAccent.jsx';
import { getAllProjects, getProjectById } from '../services/api.js';
import { formatProjectDate } from '../utils/date.js';
import { isVideoProject, sortPortfolioItems } from '../utils/portfolio.js';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    window.scrollTo({ top: 0, behavior: 'auto' });

    Promise.all([getProjectById(id), getAllProjects({ limit: 80 })])
      .then(([currentProject, projects]) => {
        if (!active) return;
        setProject(currentProject);
        setAllProjects(projects);
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || 'Project could not be loaded.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [id]);

  const relatedProjects = useMemo(() => {
    if (!project) return [];
    const candidates = allProjects.filter((item) => item.id !== project.id);
    return sortPortfolioItems(candidates).sort((left, right) => {
      const leftScore = Number(left.type === project.type) + Number(left.category === project.category);
      const rightScore = Number(right.type === project.type) + Number(right.category === project.category);
      return rightScore - leftScore;
    }).slice(0, 3);
  }, [allProjects, project]);

  if (loading) {
    return (
      <main className="page-pad relative overflow-hidden bg-ink">
        <LazyPage3DAccent
          variant="detail"
          className="right-[-10rem] top-28 h-[22rem] w-[30rem] opacity-35 sm:right-[-6rem] sm:h-[27rem] sm:w-[36rem] sm:opacity-55"
        />
        <div className="section-shell relative z-10 text-sm text-white/55">Loading project...</div>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="page-pad relative overflow-hidden bg-ink">
        <LazyPage3DAccent
          variant="notFound"
          className="right-[-10rem] top-28 h-[22rem] w-[30rem] opacity-35 sm:right-[-6rem] sm:h-[27rem] sm:w-[36rem] sm:opacity-55"
        />
        <div className="section-shell relative z-10">
          <EmptyState />
          {error && <p className="mt-4 text-center text-sm text-ember">{error}</p>}
        </div>
      </main>
    );
  }

  const isVideo = isVideoProject(project);
  const detailBlocks = [
    ['Role / What I did', project.role],
    ['Project goal', project.projectGoal],
    ['Editing / design process', project.process],
    ['Final result', project.result]
  ].filter(([, value]) => value);

  return (
    <main className="page-pad relative overflow-hidden bg-ink">
      <LazyPage3DAccent
        variant="detail"
        className="right-[-12rem] top-24 h-[24rem] w-[33rem] opacity-28 sm:right-[-7rem] sm:h-[29rem] sm:w-[38rem] sm:opacity-45 lg:right-[-5rem] lg:top-28 lg:h-[32rem] lg:w-[42rem] lg:opacity-55"
      />
      <article className="section-shell relative z-10">
        <Link className="inline-flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-white/50 hover:text-white" to={project.type === 'reel' ? '/reels' : project.type === 'video' ? '/videos' : '/designs'}>
          <ArrowLeft size={15} /> Back to work
        </Link>

        <header className="mt-7 grid gap-8 border-b border-white/15 pb-10 lg:grid-cols-[1fr_0.48fr] lg:items-end">
          <div>
            <p className="eyebrow">{project.type} / {project.category || 'Portfolio project'}</p>
            <h1 className="mt-4 max-w-5xl font-display text-[clamp(3.8rem,10vw,8.5rem)] font-black uppercase leading-[0.78] tracking-[-0.035em] text-frost">{project.title}</h1>
          </div>
          <div className="border-l border-white/15 pl-5">
            <p className="text-sm leading-7 text-white/65">{project.description}</p>
            <dl className="mt-5 grid grid-cols-2 gap-4 font-mono text-[0.62rem] uppercase tracking-[0.1em]">
              {(project.projectDate || project.createdAt) && <div><dt className="text-white/30">Created</dt><dd className="mt-1 text-white/70">{formatProjectDate(project.projectDate || project.createdAt)}</dd></div>}
              {project.aspectRatio && <div><dt className="text-white/30">Format</dt><dd className="mt-1 text-white/70">{project.aspectRatio}</dd></div>}
              {project.clientName && <div><dt className="text-white/30">Client</dt><dd className="mt-1 text-white/70">{project.clientName}</dd></div>}
              {project.role && <div><dt className="text-white/30">Role</dt><dd className="mt-1 text-white/70">{project.role}</dd></div>}
            </dl>
          </div>
        </header>

        <section className="mt-8 border border-white/15 bg-black p-2 sm:p-4">
          <div className={`grid min-h-[48svh] place-items-center ${project.type === 'reel' ? 'mx-auto max-w-lg' : ''}`}>
            {isVideo ? (
              <video className="max-h-[80svh] w-full object-contain" controls muted playsInline preload="metadata" poster={project.thumbnailUrl}>
                <source src={project.mediaUrl} />
              </video>
            ) : (
              <button className="group relative grid w-full place-items-center" onClick={() => setLightboxOpen(true)} aria-label={`Enlarge ${project.title}`}>
                <img src={project.mediaUrl || project.thumbnailUrl} alt={project.title} className="max-h-[82svh] h-auto w-auto max-w-full object-contain" />
                <span className="absolute bottom-4 right-4 grid h-11 w-11 place-items-center bg-frost text-ink transition group-hover:bg-acid"><Maximize2 size={18} /></span>
              </button>
            )}
          </div>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[0.42fr_1fr]">
          <div>
            <p className="eyebrow">Project notes</p>
            <div className="mt-5 flex flex-wrap gap-2">{(project.tools || []).map((tool) => <span className="meta-pill" key={tool}>{tool}</span>)}</div>
            {project.externalUrl && <a className="btn-secondary mt-5" href={project.externalUrl} target="_blank" rel="noreferrer"><ExternalLink size={16} /> View published work</a>}
          </div>
          <div className="grid gap-px bg-white/10 sm:grid-cols-2">
            {detailBlocks.map(([label, value]) => (
              <div className="bg-graphite p-6 sm:p-8" key={label}>
                <h2 className="font-display text-3xl font-semibold uppercase leading-none text-frost">{label}</h2>
                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-white/60">{value}</p>
              </div>
            ))}
          </div>
        </section>

        {relatedProjects.length > 0 && (
          <section className="section-pad pb-0">
            <p className="eyebrow">Related projects</p>
            <h2 className="section-title mt-3">More from the timeline.</h2>
            <div className="mt-8"><PortfolioGrid items={relatedProjects} variant={project.type === 'reel' ? 'reel' : project.type === 'video' ? 'video' : 'design'} /></div>
          </section>
        )}

        <section className="my-16 border border-white/15 bg-graphite p-7 sm:p-10">
          <p className="font-display text-4xl font-semibold uppercase text-frost sm:text-6xl">Like this style?</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link className="btn-primary" to="/contact">Hire me</Link>
            <Link className="btn-secondary" to="/">View more work</Link>
          </div>
        </section>
      </article>

      <ProjectLightbox item={lightboxOpen ? project : null} onClose={() => setLightboxOpen(false)} />
    </main>
  );
};

export default ProjectDetail;
