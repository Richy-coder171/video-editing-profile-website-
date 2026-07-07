import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext.js';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-ink text-frost">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-electric" />
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
