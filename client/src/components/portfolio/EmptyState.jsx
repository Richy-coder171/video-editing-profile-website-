import { Link } from 'react-router-dom';
import { UploadCloud } from 'lucide-react';
import { useAuth } from '../../contexts/authContext.js';

const EmptyState = ({ className = '' }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className={`rounded-lg border border-dashed border-white/15 bg-black/25 p-8 text-center ${className}`}>
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/10 text-electric">
        <UploadCloud size={20} />
      </div>
      <h3 className="mt-4 font-display text-2xl font-bold text-white">No projects uploaded yet.</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/55">
        Your real uploaded work will appear here after you add media from the admin dashboard.
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
