const steps = ['Raw Footage', 'Cutting', 'Beat Sync', 'Transitions', 'Color Grade', 'Sound Design', 'Final Export'];

const ProcessTimeline = () => (
  <section className="section-pad relative overflow-hidden bg-ink">
    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-hotpink/40 to-transparent" />
    <div className="pointer-events-none absolute right-[-12rem] top-20 h-80 w-80 rounded-full bg-violet/10 blur-3xl" />
    <div className="section-shell">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="lg:sticky lg:top-28 lg:h-fit">
          <p className="eyebrow">Editing process</p>
          <h2 className="reveal-text section-title mt-3">
            A polished process from raw footage to final delivery.
          </h2>
          <p className="mt-6 max-w-lg text-sm leading-7 text-white/60">
            A clear production pipeline keeps each project fast, focused, and consistent across platforms.
          </p>
        </div>

        <div className="relative space-y-4">
          <span className="absolute left-[2.35rem] top-4 hidden h-[calc(100%-2rem)] w-px bg-gradient-to-b from-electric via-hotpink to-transparent sm:block" />
          {steps.map((step, index) => (
            <article
              key={step}
              className="panel-premium relative grid gap-5 overflow-hidden rounded-lg p-5 transition duration-500 hover:-translate-y-1 hover:border-electric/30 sm:grid-cols-[90px_1fr]"
            >
              <span className="absolute right-4 top-4 h-16 w-24 skew-x-[-16deg] border border-electric/20 bg-electric/5" />
              <span className="relative z-10 grid h-16 w-16 place-items-center rounded-full border border-white/10 bg-black font-display text-2xl font-black text-white shadow-glow">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="font-display text-2xl font-semibold text-white">{step}</h3>
                <p className="mt-2 text-sm leading-7 text-white/60">
                  {index === 0 && 'Review footage, define the hook, identify strongest moments, and map the final arc.'}
                  {index === 1 && 'Shape the timeline with clean pacing, beat-aware cuts, and strong scene rhythm.'}
                  {index === 2 && 'Lock cuts, captions, and transitions to the beat so the edit feels energetic and intentional.'}
                  {index === 3 && 'Add motion, speed ramps, manga-style impact beats, and visual accents only where they help.'}
                  {index === 4 && 'Create the cinematic look with contrast, neon tone, skin-safe color, and platform-ready output.'}
                  {index === 5 && 'Balance voice, music, sound effects, ambience, and impact moments for a finished feel.'}
                  {index === 6 && 'Deliver polished exports, thumbnails, reels crops, and final assets ready to publish.'}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default ProcessTimeline;
