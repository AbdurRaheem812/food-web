import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getMyRestaurants } from '../../api/restaurantApi';

const STATUS_CONFIG = {
  PENDING: { icon: '⏳', label: 'Under Review', color: 'text-orange-400' },
  REJECTED: { icon: '✕', label: 'Rejected', color: 'text-red-400' },
  APPROVED: { icon: '✓', label: 'Approved', color: 'text-green-400' },
};

const MyRestaurants = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getMyRestaurants();
        setRestaurants(data);
      } catch (err) {
        setError(err.response?.data?.error?.message || 'Could not load your restaurants.');
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center text-white/50">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">My Restaurants</h1>
          <Link
            to="/owner/onboarding"
            className="px-5 py-2 rounded-full bg-orange-500 text-white text-sm font-medium shadow-[0_0_20px_rgba(255,122,26,0.4)]"
          >
            + Add Restaurant
          </Link>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {restaurants.length === 0 && !error && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 text-center">
            <p className="text-white/60 mb-4">You haven't applied with any restaurant yet.</p>
            <button
              onClick={() => navigate('/owner/onboarding')}
              className="px-6 py-2 rounded-full bg-orange-500 text-white font-medium"
            >
              Start Application
            </button>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {restaurants.map((r) => {
            const config = STATUS_CONFIG[r.applicationStatus];
            return (
              <div
                key={r.id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex items-center gap-4"
              >
                {r.logoUrl ? (
                  <img src={r.logoUrl} alt={r.name} className="w-14 h-14 rounded-xl object-cover border border-white/10" />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-white/10" />
                )}
                <div className="flex-1">
                  <p className="text-white font-semibold">{r.name}</p>
                  <p className={`text-sm ${config.color}`}>{config.icon} {config.label}</p>
                  {r.applicationStatus === 'REJECTED' && r.rejectionReason && (
                    <p className="text-white/40 text-xs mt-1">{r.rejectionReason}</p>
                  )}
                </div>
                {r.applicationStatus === 'APPROVED' && (
                  <button
                    onClick={() => navigate(`/owner/restaurants/${r.id}/menu`)}
                    className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
                  >
                    Manage
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyRestaurants;