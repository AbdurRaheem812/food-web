import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const RoleRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0D0D0F] text-white">Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  const hasAccess = user.roles.some((role) => allowedRoles.includes(role));
  if (!hasAccess) return <Navigate to="/not-allowed" replace />;

  return <Outlet />;
};

export default RoleRoute;