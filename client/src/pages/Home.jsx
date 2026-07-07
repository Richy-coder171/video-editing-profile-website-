import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroSection from '../components/sections/HeroSection.jsx';
import FeaturedShowcase from '../components/sections/FeaturedShowcase.jsx';
import ReelsHorizontal from '../components/sections/ReelsHorizontal.jsx';
import ServicesTools from '../components/sections/ServicesTools.jsx';
import ProcessTimeline from '../components/sections/ProcessTimeline.jsx';
import ContactCTA from '../components/sections/ContactCTA.jsx';
import usePortfolio from '../hooks/usePortfolio.js';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const { items } = usePortfolio('/portfolio/featured');

  useEffect(() => {
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

      gsap.utils.toArray('.panel-premium').forEach((element) => {
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

      window.addEventListener('load', ScrollTrigger.refresh);
    });

    return () => {
      window.removeEventListener('load', ScrollTrigger.refresh);
      ctx.revert();
    };
  }, []);

  return (
    <main>
      <HeroSection />
      <FeaturedShowcase items={items} />
      <ReelsHorizontal items={items} />
      <ServicesTools />
      <ProcessTimeline />
      <ContactCTA />
    </main>
  );
};

export default Home;
