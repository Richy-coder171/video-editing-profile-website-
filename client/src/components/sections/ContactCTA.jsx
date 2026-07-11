import { Link } from 'react-router-dom';
import { ArrowRight, Mail } from 'lucide-react';

const ContactCTA = () => (
  <section className="section-pad bg-graphite">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="anime-surface rounded-sm bg-black p-8 sm:p-12 lg:p-16">
        <div className="absolute inset-y-0 right-0 hidden w-1/3 border-l border-white/10 bg-[linear-gradient(90deg,transparent,rgba(104,167,255,0.08))] lg:block" />
        <div className="relative max-w-4xl">
          <p className="eyebrow">New sequence / 04</p>
          <h2 className="mt-3 font-display text-5xl font-bold uppercase leading-[0.9] text-frost md:text-7xl lg:text-8xl">
            Your footage.<br /><span className="text-transparent [-webkit-text-stroke:1px_#68a7ff]">A sharper pulse.</span>
          </h2>
          <p className="mt-5 text-sm leading-7 text-white/60">
            Send the project details, deadline, references, and platform goals. I will shape the visuals around the
            rhythm, audience, and feeling you want the final piece to carry.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/contact" className="btn-primary">
              <Mail size={18} />
              Send the brief
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
