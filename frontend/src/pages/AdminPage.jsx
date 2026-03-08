import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { adminAPI } from '../lib/api';

const initialMovieForm = {
  title: '',
  posterUrl: '',
  description: '',
  movieId: '',
  releaseDate: '',
  trailerYoutubeLink: '',
  genre: '',
  category: 'movie',
};

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('users');
  const [editingMovie, setEditingMovie] = useState(null);
  const [form, setForm] = useState(initialMovieForm);

  const loadData = async () => {
    try {
      setError(null);
      const [usersRes, statsRes, moviesRes] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getStats(),
        adminAPI.getMovies(),
      ]);
      setUsers(usersRes.data.users || []);
      setStats(statsRes.data.stats || {});
      setMovies(moviesRes.data.movies || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBanUser = async (userId) => {
    try {
      const res = await adminAPI.banUser(userId);
      setUsers((u) =>
        u.map((x) => (x._id === userId ? { ...x, isBanned: res.data.isBanned } : x))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminAPI.deleteUser(userId);
      setUsers((u) => u.filter((x) => x._id !== userId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleSubmitMovie = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingMovie) {
        await adminAPI.updateMovie(editingMovie._id, form);
        setMovies((m) => m.map((x) => (x._id === editingMovie._id ? { ...x, ...form } : x)));
      } else {
        const res = await adminAPI.addMovie(form);
        setMovies((m) => [res.data.movie, ...m]);
      }
      setForm(initialMovieForm);
      setEditingMovie(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save movie');
    }
  };

  const handleEditMovie = (movie) => {
    setEditingMovie(movie);
    setForm({
      title: movie.title || '',
      posterUrl: movie.posterUrl || '',
      description: movie.description || 'Description not available',
      movieId: movie.movieId || '',
      releaseDate: movie.releaseDate || '',
      trailerYoutubeLink: movie.trailerYoutubeLink || '',
      genre: movie.genre || '',
      category: movie.category || 'movie',
    });
    setTab('movies');
  };

  const handleDeleteMovie = async (id) => {
    if (!confirm('Delete this movie?')) return;
    try {
      await adminAPI.deleteMovie(id);
      setMovies((m) => m.filter((x) => x._id !== id));
      if (editingMovie?._id === id) {
        setEditingMovie(null);
        setForm(initialMovieForm);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete movie');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="animate-spin w-12 h-12 border-2 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Dashboard</h1>

      {error && (
        <div className="p-4 rounded-lg bg-rose-500/20 text-rose-400 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-3 sm:p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <p className="text-slate-400 text-xs sm:text-sm">Users</p>
          <p className="text-xl sm:text-2xl font-bold text-amber-400">{stats?.users ?? 0}</p>
        </div>
        <div className="p-3 sm:p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <p className="text-slate-400 text-xs sm:text-sm">Favorites</p>
          <p className="text-xl sm:text-2xl font-bold text-rose-400">{stats?.favorites ?? 0}</p>
        </div>
        <div className="p-3 sm:p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <p className="text-slate-400 text-xs sm:text-sm">Watchlist</p>
          <p className="text-xl sm:text-2xl font-bold text-emerald-400">{stats?.watchlist ?? 0}</p>
        </div>
        <div className="p-3 sm:p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <p className="text-slate-400 text-xs sm:text-sm">History</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-400">{stats?.history ?? 0}</p>
        </div>
        <div className="p-3 sm:p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <p className="text-slate-400 text-xs sm:text-sm">Admin Movies</p>
          <p className="text-xl sm:text-2xl font-bold text-purple-400">{stats?.adminMovies ?? 0}</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-700/50 pb-2">
        <button
          onClick={() => setTab('users')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'users' ? 'bg-amber-500/30 text-amber-400' : 'bg-slate-700/50 text-slate-400 hover:text-white'
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setTab('movies')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'movies' ? 'bg-amber-500/30 text-amber-400' : 'bg-slate-700/50 text-slate-400 hover:text-white'
          }`}
        >
          Movies
        </button>
      </div>

      {tab === 'users' && (
        <div className="rounded-xl overflow-hidden border border-slate-700/50">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead className="bg-slate-800/80">
                <tr>
                  <th className="text-left px-3 sm:px-4 py-3 text-slate-400 font-medium text-xs sm:text-sm">Username</th>
                  <th className="text-left px-3 sm:px-4 py-3 text-slate-400 font-medium text-xs sm:text-sm hidden sm:table-cell">Email</th>
                  <th className="text-left px-3 sm:px-4 py-3 text-slate-400 font-medium text-xs sm:text-sm">Role</th>
                  <th className="text-left px-3 sm:px-4 py-3 text-slate-400 font-medium text-xs sm:text-sm">Status</th>
                  <th className="text-right px-3 sm:px-4 py-3 text-slate-400 font-medium text-xs sm:text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-800/30">
                    <td className="px-3 sm:px-4 py-3 text-white text-sm">{user.username}</td>
                    <td className="px-3 sm:px-4 py-3 text-slate-400 text-sm hidden sm:table-cell truncate max-w-[180px]">{user.email}</td>
                    <td className="px-3 sm:px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs ${user.role === 'admin' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-400'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      {user.isBanned ? (
                        <span className="text-rose-400 text-xs sm:text-sm">Banned</span>
                      ) : (
                        <span className="text-emerald-400 text-xs sm:text-sm">Active</span>
                      )}
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-right space-x-2">
                      {user.role !== 'admin' && (
                        <>
                          <button
                            onClick={() => handleBanUser(user._id)}
                            className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm transition-colors ${
                              user.isBanned ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                            }`}
                            title={user.isBanned ? 'Unban' : 'Ban'}
                          >
                            {user.isBanned ? 'Unban' : 'Ban'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="px-2 sm:px-3 py-1 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/40 text-xs sm:text-sm transition-colors"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'movies' && (
        <>
          <form onSubmit={handleSubmitMovie} className="p-4 sm:p-6 rounded-xl bg-slate-800/30 border border-slate-700/50 space-y-3 sm:space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold text-white">
              {editingMovie ? 'Edit Movie' : 'Add Movie'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-slate-400 text-xs sm:text-sm mb-1">Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white text-sm"
                  placeholder="Movie title"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-xs sm:text-sm mb-1">Movie ID *</label>
                <input
                  value={form.movieId}
                  onChange={(e) => setForm((f) => ({ ...f, movieId: e.target.value }))}
                  required
                  disabled={!!editingMovie}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white text-sm disabled:opacity-60"
                  placeholder="Unique ID"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-400 text-xs sm:text-sm mb-1">Poster URL</label>
              <input
                type="url"
                value={form.posterUrl}
                onChange={(e) => setForm((f) => ({ ...f, posterUrl: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white text-sm"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-slate-400 text-xs sm:text-sm mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white text-sm resize-y"
                placeholder="Description not available"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-slate-400 text-xs sm:text-sm mb-1">Release Date</label>
                <input
                  value={form.releaseDate}
                  onChange={(e) => setForm((f) => ({ ...f, releaseDate: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white text-sm"
                  placeholder="YYYY-MM-DD"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-xs sm:text-sm mb-1">Genre</label>
                <input
                  value={form.genre}
                  onChange={(e) => setForm((f) => ({ ...f, genre: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white text-sm"
                  placeholder="e.g. Action, Drama"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-400 text-xs sm:text-sm mb-1">Trailer YouTube Link</label>
              <input
                type="url"
                value={form.trailerYoutubeLink}
                onChange={(e) => setForm((f) => ({ ...f, trailerYoutubeLink: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white text-sm"
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
            <div>
              <label className="block text-slate-400 text-xs sm:text-sm mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white text-sm"
              >
                <option value="movie">Movie</option>
                <option value="tv">TV</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-900 font-medium text-sm"
              >
                {editingMovie ? 'Update' : 'Add'} Movie
              </button>
              {editingMovie && (
                <button
                  type="button"
                  onClick={() => { setEditingMovie(null); setForm(initialMovieForm); }}
                  className="px-4 py-2 rounded-lg bg-slate-700 text-slate-300 text-sm"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Admin Movies</h2>
            {movies.length === 0 ? (
              <p className="text-slate-400 text-sm">No admin-added movies yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px] rounded-xl overflow-hidden border border-slate-700/50">
                  <thead className="bg-slate-800/80">
                    <tr>
                      <th className="text-left px-3 py-2 text-slate-400 font-medium text-xs">Title</th>
                      <th className="text-left px-3 py-2 text-slate-400 font-medium text-xs">ID</th>
                      <th className="text-left px-3 py-2 text-slate-400 font-medium text-xs">Category</th>
                      <th className="text-right px-3 py-2 text-slate-400 font-medium text-xs">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {movies.map((m) => (
                      <tr key={m._id} className="hover:bg-slate-800/30">
                        <td className="px-3 py-2 text-white text-sm truncate max-w-[200px]">{m.title}</td>
                        <td className="px-3 py-2 text-slate-400 text-sm">{m.movieId}</td>
                        <td className="px-3 py-2 text-slate-400 text-sm">{m.category}</td>
                        <td className="px-3 py-2 text-right">
                          <button
                            onClick={() => handleEditMovie(m)}
                            className="px-2 py-1 rounded bg-amber-500/20 text-amber-400 text-xs mr-1"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteMovie(m._id)}
                            className="px-2 py-1 rounded bg-rose-500/20 text-rose-400 text-xs"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
