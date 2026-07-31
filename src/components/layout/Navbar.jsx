import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isOwner = user?.roles?.includes('OWNER');
  const isAdmin = user?.roles?.includes('ADMIN');

  return (
    <nav className="sticky top-0 z-50 bg-white/5 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="text-2xl font-bold text-white">
          Food<span className="text-orange-500">Hub</span>
        </Link>

        {/* Center links — change based on auth state */}
        <div className="hidden md:flex items-center gap-8 text-white/70 text-sm font-medium">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>

          {user && !isOwner && !isAdmin && (
            <Link to="/dashboard" className="hover:text-white transition-colors">My Orders</Link>
          )}

          {isOwner && (
            <Link to="/owner/dashboard" className="hover:text-white transition-colors">Owner Dashboard</Link>
          )}

          {isAdmin && (
            <Link to="/admin/dashboard" className="hover:text-white transition-colors">Admin Panel</Link>
          )}
        </div>

        {/* Right side — auth actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden sm:block text-white/60 text-sm">
                Hi, <span className="text-white font-medium">{user.username}</span>
              </span>
              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-full bg-white/10 border border-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-5 py-2 rounded-full text-white/80 text-sm font-medium hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 rounded-full bg-orange-500 text-white text-sm font-medium shadow-[0_0_20px_rgba(255,122,26,0.4)] hover:bg-orange-400 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;