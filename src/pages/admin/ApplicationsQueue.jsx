import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPendingApplications, decideApplication } from '../../api/adminApi';

const ApplicationsQueue = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const load = async () => {
    try {
      setApplications(await getPendingApplications());
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Could not load applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDecision = async (id, decision) => {
    let reason;
    if (decision === 'REJECTED') {
      reason = window.prompt('Reason for rejecting this application:');
      if (!reason) return;
    }
    setUpdatingId(id);
    try {
      await decideApplication(id, decision, reason);
      load();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Could not update application.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center text-white/50">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0D0D0F] px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Pending Applications</h1>
          <Link to="/admin/users" className="text-white/50 hover:text-white text-sm">Manage Users →</Link>
          <Link to="/admin/stats" className="text-white/50 hover:text-white text-sm">Stats →</Link>
        </div>

        {error && <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}
        {applications.length === 0 && <p className="text-white/40">No pending applications.</p>}

        <div className="flex flex-col gap-3">
          {applications.map((r) => (
            <div key={r.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-2">
                {r.logoUrl && <img src={r.logoUrl} alt={r.name} className="w-12 h-12 rounded-xl object-cover" />}
                <div>
                  <p className="text-white font-medium">{r.name}</p>
                  <p className="text-white/40 text-xs">{r.owner.username} · {r.owner.email}</p>
                </div>
              </div>
              <p className="text-white/50 text-xs mb-3">
                {r.restaurantCuisines.map((rc) => rc.cuisine.name).join(', ')} · {r.address}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDecision(r.id, 'APPROVED')}
                  disabled={updatingId === r.id}
                  className="px-4 py-1.5 rounded-full bg-green-500/20 text-green-400 disabled:opacity-50 text-xs font-medium"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleDecision(r.id, 'REJECTED')}
                  disabled={updatingId === r.id}
                  className="px-4 py-1.5 rounded-full bg-red-500/10 text-red-400 disabled:opacity-50 text-xs font-medium"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApplicationsQueue;