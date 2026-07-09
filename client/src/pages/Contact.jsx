import { MapPin, Send, Sparkles } from 'lucide-react';
import { contactEmail, primaryContactLinks, socialLinks } from '../data/contactLinks.js';

const Contact = () => (
  <main className="page-pad bg-black">
    <section className="section-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="page-hero">
        <div className="absolute inset-0 bg-cinematic-sheen opacity-30" />
        <div className="absolute inset-0 bg-manga-lines opacity-10" />
        <p className="eyebrow">Contact</p>
        <h1 className="mt-4 font-display text-5xl font-black leading-none text-white md:text-7xl">
          Book editing and design work for your next launch.
        </h1>
        <p className="mt-6 text-base leading-8 text-white/60">
          Share the platform, deadline, reference links, footage status, and the result you want viewers to feel.
        </p>
        <div className="mt-8 grid gap-3 text-sm text-white/70">
          {primaryContactLinks.map((link) => (
            <a key={link.label} className="flex min-w-0 items-center gap-3 break-words rounded-lg border border-white/10 bg-black/25 p-3 transition hover:border-electric/30 hover:text-white" href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noreferrer' : undefined}>
              <link.icon size={18} />
              <span className="min-w-0">{link.label}</span>
            </a>
          ))}
          <span className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/25 p-3">
            <MapPin size={18} />
            Available for remote projects
          </span>
        </div>
        {socialLinks.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {socialLinks.map((link) => (
            <a key={link.label} className="btn-ghost" href={link.href} target="_blank" rel="noreferrer">
              <link.icon size={16} />
              {link.label}
            </a>
            ))}
          </div>
        )}
      </div>

      {contactEmail ? (
        <form className="anime-surface rounded-lg p-6" action={`mailto:${contactEmail}`} method="post" encType="text/plain">
          <div className="mb-6 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink shadow-glow">
              <Sparkles size={18} />
            </span>
            <div>
              <p className="eyebrow">Hire me</p>
              <h2 className="font-display text-2xl font-semibold text-white">Send the brief</h2>
            </div>
          </div>
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
          <button className="btn-primary mt-6 w-full sm:w-auto" type="submit">
            <Send size={18} />
            Send project details
          </button>
        </form>
      ) : (
        <div className="anime-surface rounded-lg border-dashed p-8">
          <p className="eyebrow">Booking</p>
          <h2 className="mt-4 font-display text-3xl font-bold text-white">Contact details coming soon.</h2>
          <p className="mt-3 text-sm leading-7 text-white/60">
            Booking links will appear here once they are connected.
          </p>
        </div>
      )}
    </section>
  </main>
);

export default Contact;
