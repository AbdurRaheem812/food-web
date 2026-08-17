import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isOwner = user?.roles?.includes('OWNER');
  const isAdmin = user?.roles?.includes('ADMIN');
  const isCustomer = user?.roles?.includes('CUSTOMER');

  return (
    <nav className="sticky top-0 z-50 bg-white/5 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-white">
          Food<span className="text-orange-500">Hub</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-white/70 text-sm font-medium">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>

          {isCustomer && (
            <Link to="/cart" className="relative hover:text-white transition-colors">
              🛒 Cart
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-4 bg-orange-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          )}

          {isOwner && (
            <Link to="/owner/orders" className="hover:text-white transition-colors">📋 Orders</Link>
          )}

          {isAdmin && (
            <Link to="/admin" className="hover:text-white transition-colors">Admin Panel</Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/profile" className="hidden sm:block text-white/60 text-sm hover:text-white transition-colors">
                Hi, <span className="text-white font-medium">{user.username}</span>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="px-5 py-2 rounded-full text-white/80 text-sm font-medium hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="px-5 py-2 rounded-full bg-orange-500 text-white text-sm font-medium shadow-[0_0_20px_rgba(255,122,26,0.4)] hover:bg-orange-400 transition-colors">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;