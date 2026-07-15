import { Link } from 'react-router-dom';
import LazyPage3DAccent from '../components/three/LazyPage3DAccent.jsx';

const NotFound = () => (
  <main className="relative grid min-h-screen place-items-center overflow-hidden bg-ink px-4 pt-20 text-center">
    <div className="pointer-events-none absolute inset-0 bg-cinematic-sheen opacity-25" />
    <LazyPage3DAccent
      variant="notFound"
      className="right-[-12rem] top-24 h-[24rem] w-[32rem] opacity-35 sm:right-[-7rem] sm:h-[30rem] sm:w-[38rem] sm:opacity-55 lg:right-[10vw] lg:top-32"
    />
    <div className="relative z-10">
      <p className="eyebrow justify-center">404</p>
      <h1 className="mt-4 font-display text-5xl font-black text-white">Scene not found</h1>
      <Link className="btn-primary mt-8 inline-flex" to="/">
        Back home
      </Link>
    </div>
  </main>
);

export default NotFound;
