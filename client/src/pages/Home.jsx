import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroSection from '../components/sections/HeroSection.jsx';
import FeaturedShowcase from '../components/sections/FeaturedShowcase.jsx';
import FeaturedShowreel from '../components/sections/FeaturedShowreel.jsx';
import ReelsHorizontal from '../components/sections/ReelsHorizontal.jsx';
import ServicesTools from '../components/sections/ServicesTools.jsx';
import ContactCTA from '../components/sections/ContactCTA.jsx';
import usePortfolio from '../hooks/usePortfolio.js';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const { items, error } = usePortfolio('/portfolio?limit=80');

  useEffect(() => {
    if (window.matchMedia('(max-width: 767px), (prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const refresh = () => ScrollTrigger.refresh();
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal-text').forEach((element) => {
        gsap.fromTo(
          element,
          { y: 42, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
          {
            y: 0,
            opacity: 1,
            clipPath: 'inset(0 0 0% 0)',
            duration: 1,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 84%'
            }
          }
        );
      });

      gsap.utils.toArray('.panel-premium, .reveal-panel').forEach((element) => {
        gsap.fromTo(
          element,
          { y: 22, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 88%'
            }
          }
        );
      });

      window.addEventListener('load', refresh);
    });

    return () => {
      window.removeEventListener('load', refresh);
      ctx.revert();
    };
  }, []);

  return (
    <main>
      <HeroSection />
      {error && (
        <section className="bg-ink px-4">
          <div className="mx-auto max-w-7xl rounded-lg border border-ember/30 bg-ember/10 p-3 text-sm text-ember">
            {error}
          </div>
        </section>
      )}
      <FeaturedShowcase items={items} />
      <FeaturedShowreel items={items} />
      <ReelsHorizontal items={items} />
      <ServicesTools />
      <ContactCTA />
    </main>
  );
};

export default Home;
