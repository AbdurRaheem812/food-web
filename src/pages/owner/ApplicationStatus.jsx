import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyApplicationStatus } from '../../api/restaurantApi';

const STATUS_CONFIG = {
  PENDING: {
    icon: '⏳',
    title: 'Application Under Review',
    message: "We're reviewing your restaurant details. This usually takes 1-2 business days.",
    color: 'text-orange-400',
  },
  REJECTED: {
    icon: '✕',
    title: 'Application Rejected',
    message: null, 
    color: 'text-red-400',
  },
  APPROVED: {
    icon: '✓',
    title: "You're approved!",
    message: 'Your restaurant is live. Head to your dashboard to start managing menu items and orders.',
    color: 'text-green-400',
  },
};

const ApplicationStatus = () => {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await getMyApplicationStatus();
        setRestaurant(data);
      } catch (err) {
        setError(err.response?.data?.error?.message || 'Could not load application status.');
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center text-white/50">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center px-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center max-w-md">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/owner/onboarding')}
            className="px-6 py-2 rounded-full bg-orange-500 text-white font-medium"
          >
            Start Application
          </button>
        </div>
      </div>
    );
  }

  const config = STATUS_CONFIG[restaurant.applicationStatus];

  return (
    <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 text-center shadow-2xl">
        {restaurant.logoUrl && (
          <img
            src={restaurant.logoUrl}
            alt={restaurant.name}
            className="w-20 h-20 rounded-2xl object-cover mx-auto mb-4 border border-white/10"
          />
        )}
        <div className="text-4xl mb-3">{config.icon}</div>
        <h1 className={`text-2xl font-bold mb-2 ${config.color}`}>{config.title}</h1>
        <p className="text-white/60 mb-6">
          {restaurant.applicationStatus === 'REJECTED' ? restaurant.rejectionReason : config.message}
        </p>

        {restaurant.applicationStatus === 'APPROVED' && (
          <button
            onClick={() => navigate('/owner/dashboard')}
            className="w-full bg-orange-500 hover:bg-orange-400 text-white font-semibold py-3 rounded-full shadow-[0_0_20px_rgba(255,122,26,0.4)] transition-colors"
          >
            Go to Dashboard
          </button>
        )}

        {restaurant.applicationStatus === 'REJECTED' && (
          <button
            onClick={() => navigate('/owner/onboarding')}
            className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-full transition-colors"
          >
            Reapply
          </button>
        )}
      </div>
    </div>
  );
};

export default ApplicationStatus;