const steps = ['Raw Footage', 'Cutting', 'Transitions', 'Color Grade', 'Sound Design', 'Final Output'];

const ProcessTimeline = () => (
  <section className="section-pad bg-ink">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="lg:sticky lg:top-28 lg:h-fit">
          <p className="eyebrow">Editing process</p>
          <h2 className="reveal-text mt-3 font-display text-4xl font-bold text-white md:text-6xl">
            From messy footage to a polished final drop.
          </h2>
          <p className="mt-6 max-w-lg text-sm leading-7 text-white/60">
            A clear production pipeline keeps each project fast, focused, and consistent across platforms.
          </p>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <article key={step} className="grid gap-5 rounded-lg border border-white/10 bg-white/[0.04] p-5 sm:grid-cols-[90px_1fr]">
              <span className="font-display text-4xl font-black text-white/20">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="font-display text-2xl font-semibold text-white">{step}</h3>
                <p className="mt-2 text-sm leading-7 text-white/60">
                  {index === 0 && 'Review footage, define the hook, identify strongest moments, and map the final arc.'}
                  {index === 1 && 'Shape the timeline with clean pacing, beat-aware cuts, and strong scene rhythm.'}
                  {index === 2 && 'Add motion, transitions, captions, speed ramps, and visual accents only where they help.'}
                  {index === 3 && 'Create the cinematic look with contrast, tone, skin-safe color, and platform-ready output.'}
                  {index === 4 && 'Balance voice, music, sound effects, ambience, and impact moments for a finished feel.'}
                  {index === 5 && 'Deliver polished exports, thumbnails, reels crops, and final assets ready to publish.'}
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
