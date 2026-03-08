import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHistory } from '../store/slices/historySlice';
import MovieCard from '../components/MovieCard';

export default function HistoryPage() {
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.history);

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);

  const movies = items.map((h) => ({
    id: h.movieId,
    title: h.title,
    poster_path: h.poster ? null : null,
    poster: h.poster,
  }));

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Watch History</h1>
      <p className="text-slate-400 mb-8">Movies you've recently viewed</p>

      {items.length === 0 ? (
        <div className="text-center py-16 text-slate-400 rounded-xl bg-slate-800/30 border border-slate-700/50">
          <p className="text-lg">No watch history yet.</p>
          <p className="mt-2">Click on any movie to start tracking your viewing history.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
