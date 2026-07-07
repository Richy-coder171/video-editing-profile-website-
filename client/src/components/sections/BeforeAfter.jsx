const BeforeAfter = () => (
  <section className="section-pad bg-black">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-10 max-w-3xl">
        <p className="eyebrow">Before and after</p>
        <h2 className="reveal-text mt-3 font-display text-4xl font-bold text-white md:text-6xl">
          Raw scenes get rebuilt into cinematic moments.
        </h2>
      </div>

      <div className="grid overflow-hidden rounded-lg border border-white/10 md:grid-cols-2">
        <div className="relative min-h-[360px] bg-zinc-950">
          <img src="/cinematic-editor-hero.png" alt="Raw editing board" className="absolute inset-0 h-full w-full object-cover opacity-45 grayscale" />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute bottom-6 left-6 right-6">
            <p className="text-xs uppercase tracking-[0.26em] text-white/50">Before</p>
            <h3 className="mt-2 font-display text-3xl font-semibold text-white">Unsorted footage and flat visuals</h3>
          </div>
        </div>
        <div className="relative min-h-[360px] bg-zinc-950">
          <img src="/cinematic-editor-hero.png" alt="Final cinematic timeline" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <p className="text-xs uppercase tracking-[0.26em] text-electric">After</p>
            <h3 className="mt-2 font-display text-3xl font-semibold text-white">Color, rhythm, sound, and story</h3>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default BeforeAfter;
