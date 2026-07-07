import { ExternalLink, Instagram, Mail, MapPin, MessageCircle, Send, Youtube } from 'lucide-react';

const Contact = () => (
  <main className="page-pad bg-black">
    <section className="section-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <p className="eyebrow">Contact</p>
        <h1 className="mt-4 font-display text-5xl font-black leading-none text-white md:text-7xl">
          Book editing and design work for your next launch.
        </h1>
        <p className="mt-6 text-base leading-8 text-white/60">
          Share the platform, deadline, reference links, footage status, and the result you want viewers to feel.
        </p>
        <div className="mt-8 grid gap-3 text-sm text-white/70">
          <a className="flex items-center gap-3 hover:text-white" href="mailto:hello@example.com">
            <Mail size={18} />
            hello@example.com
          </a>
          <a className="flex items-center gap-3 hover:text-white" href="https://wa.me/0000000000" target="_blank" rel="noreferrer">
            <MessageCircle size={18} />
            WhatsApp
          </a>
          <span className="flex items-center gap-3">
            <MapPin size={18} />
            Available for remote projects
          </span>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {[
            { label: 'Instagram', href: 'https://instagram.com/', icon: Instagram },
            { label: 'YouTube', href: 'https://youtube.com/', icon: Youtube },
            { label: 'Behance', href: 'https://behance.net/', icon: ExternalLink },
            { label: 'Dribbble', href: 'https://dribbble.com/', icon: ExternalLink }
          ].map((link) => (
            <a key={link.label} className="btn-ghost" href={link.href} target="_blank" rel="noreferrer">
              <link.icon size={16} />
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <form className="rounded-lg border border-white/10 bg-white/[0.045] p-6" action="mailto:hello@example.com" method="post" encType="text/plain">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="field-label">
            Name
            <input className="input" name="name" required placeholder="Your name" />
          </label>
          <label className="field-label">
            Email
            <input className="input" type="email" name="email" required placeholder="you@example.com" />
          </label>
        </div>
        <label className="field-label mt-4">
          Project type
          <select className="input" name="projectType" defaultValue="Reels">
            <option>Reels</option>
            <option>YouTube edit</option>
            <option>Thumbnail design</option>
            <option>Poster or branding</option>
            <option>Full campaign</option>
          </select>
        </label>
        <label className="field-label mt-4">
          Message
          <textarea className="input min-h-40 resize-y" name="message" required placeholder="Tell me about the footage, goal, deadline, and references." />
        </label>
        <button className="btn-primary mt-6" type="submit">
          <Send size={18} />
          Send project details
        </button>
      </form>
    </section>
  </main>
);

export default Contact;
