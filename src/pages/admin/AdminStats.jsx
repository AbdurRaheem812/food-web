import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getPlatformStats } from '../../api/adminApi';

const COLORS = ['#f97316', '#3b82f6', '#22c55e', '#a855f7', '#eab308', '#ef4444', '#6b7280'];

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getPlatformStats().then(setStats).catch((err) => setError(err.response?.data?.error?.message || 'Could not load stats.'));
  }, []);

  if (error) return <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center text-red-400">{error}</div>;
  if (!stats) return <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center text-white/50">Loading...</div>;

  const cards = [
    { label: 'Total Users', value: stats.totalUsers },
    { label: 'Approved Restaurants', value: stats.totalRestaurants },
    { label: 'Pending Applications', value: stats.pendingApplications },
    { label: 'Total Orders', value: stats.totalOrders },
    { label: 'Total Revenue', value: `RS.${stats.totalRevenue.toFixed(2)}` },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0F] px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Platform Overview</h1>
          <Link to="/admin" className="text-white/50 hover:text-white text-sm">← Applications</Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          {cards.map((c) => (
            <div key={c.label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-white/50 text-xs">{c.label}</p>
              <p className="text-white text-xl font-bold mt-1">{c.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-white font-medium mb-3">Orders by Status</p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={stats.ordersByStatus} dataKey="count" nameKey="status" outerRadius={80} label>
                  {stats.ordersByStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-white font-medium mb-3">Top Restaurants by Revenue</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.topRestaurants}>
                <XAxis dataKey="name" tick={{ fill: '#999', fontSize: 10 }} />
                <YAxis tick={{ fill: '#999', fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;