import { Link } from 'react-router-dom';
import { ArrowRight, Mail } from 'lucide-react';

const ContactCTA = () => (
  <section className="section-pad bg-graphite">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="anime-surface rounded-lg bg-black p-8 sm:p-12 lg:p-16">
        <div className="absolute inset-0 bg-radial-grid opacity-80" />
        <div className="absolute inset-0 bg-manga-lines opacity-10" />
        <div className="relative max-w-3xl">
          <p className="eyebrow">Hire me</p>
          <h2 className="mt-3 font-display text-4xl font-bold text-white md:text-6xl">
            Ready to turn your next idea into a polished visual drop?
          </h2>
          <p className="mt-5 text-sm leading-7 text-white/60">
            Send the project details, deadline, references, and platform goals. I will shape the visuals around the
            rhythm, audience, and feeling you want the final piece to carry.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/contact" className="btn-primary">
              <Mail size={18} />
              Start a project
            </Link>
            <Link to="/videos" className="btn-secondary">
              See video edits
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default ContactCTA;
