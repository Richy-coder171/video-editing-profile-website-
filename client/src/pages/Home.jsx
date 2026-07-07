import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroSection from '../components/sections/HeroSection.jsx';
import FeaturedShowcase from '../components/sections/FeaturedShowcase.jsx';
import ReelsHorizontal from '../components/sections/ReelsHorizontal.jsx';
import ServicesTools from '../components/sections/ServicesTools.jsx';
import ProcessTimeline from '../components/sections/ProcessTimeline.jsx';
import BeforeAfter from '../components/sections/BeforeAfter.jsx';
import ContactCTA from '../components/sections/ContactCTA.jsx';
import usePortfolio from '../hooks/usePortfolio.js';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const { items } = usePortfolio('/portfolio/featured', (item) => item.featured);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal-text').forEach((element) => {
        gsap.fromTo(
          element,
          { y: 34, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 82%'
            }
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <main>
      <HeroSection />
      <FeaturedShowcase items={items} />
      <ReelsHorizontal items={items} />
      <ServicesTools />
      <ProcessTimeline />
      <BeforeAfter />
      <ContactCTA />
    </main>
  );
};

export default Home;
