import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';
import { getUsers, toggleUserBlock } from '../../api/adminApi';

const UsersTable = () => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data = await getUsers({ search: debouncedSearch || undefined, page, limit: 15 });
      setUsers(data.users);
      setMeta(data.meta);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Could not load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [debouncedSearch, page]);

  const handleToggleBlock = async (id) => {
    try {
      await toggleUserBlock(id);
      load();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Could not update user.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <Link to="/admin" className="text-white/50 hover:text-white text-sm">← Applications</Link>
        </div>

        <input
          placeholder="Search by username or email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full mb-5 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-white placeholder-white/40 focus:outline-none focus:border-orange-500"
        />

        {error && <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}

        {loading ? (
          <p className="text-white/40">Loading...</p>
        ) : (
          <div className="flex flex-col gap-2">
            {users.map((u) => (
              <div key={u.id} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">{u.username} <span className="text-white/40 font-normal">· {u.email}</span></p>
                  <p className="text-white/40 text-xs">{u.userRoles.map((ur) => ur.role.role).join(', ')}</p>
                </div>
                <button
                  onClick={() => handleToggleBlock(u.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium ${u.isBlocked ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/60'}`}
                >
                  {u.isBlocked ? 'Blocked' : 'Active'}
                </button>
              </div>
            ))}
          </div>
        )}

        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-sm disabled:opacity-30">Prev</button>
            <span className="text-white/60 text-sm px-3">Page {meta.page} of {meta.totalPages}</span>
            <button disabled={page >= meta.totalPages} onClick={() => setPage(page + 1)} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-sm disabled:opacity-30">Next</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersTable;