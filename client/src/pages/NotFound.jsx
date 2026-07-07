import { Link } from 'react-router-dom';

const NotFound = () => (
  <main className="grid min-h-screen place-items-center bg-ink px-4 pt-20 text-center">
    <div>
      <p className="eyebrow justify-center">404</p>
      <h1 className="mt-4 font-display text-5xl font-black text-white">Scene not found</h1>
      <Link className="btn-primary mt-8 inline-flex" to="/">
        Back home
      </Link>
    </div>
  </main>
);

export default NotFound;
