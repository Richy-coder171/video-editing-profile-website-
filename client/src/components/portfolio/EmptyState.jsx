import { Link } from 'react-router-dom';
import { UploadCloud } from 'lucide-react';
import { useAuth } from '../../contexts/authContext.js';

const EmptyState = ({ className = '' }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className={`anime-surface rounded-lg border-dashed p-8 text-center sm:p-10 ${className}`}>
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-electric/25 bg-electric/10 text-electric shadow-glow">
        <UploadCloud size={20} />
      </div>
      <h3 className="mt-4 font-display text-2xl font-bold text-white">No projects uploaded yet.</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/55">
        Upload your first project from the admin dashboard. Your real work will appear here.
      </p>
      {isAuthenticated && (
        <Link to="/admin" className="btn-primary mt-6 inline-flex">
          Upload work
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
