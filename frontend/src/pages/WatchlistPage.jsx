import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWatchlist } from '../store/slices/watchlistSlice';
import MovieCard from '../components/MovieCard';

export default function WatchlistPage() {
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.watchlist);

  useEffect(() => {
    dispatch(fetchWatchlist());
  }, [dispatch]);

  const movies = items.map((w) => ({
    id: w.movieId,
    title: w.title,
    poster_path: w.poster ? null : null,
    poster: w.poster,
  }));

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">My Watchlist</h1>
      <p className="text-slate-400 mb-8">Movies you plan to watch</p>

      {items.length === 0 ? (
        <div className="text-center py-16 text-slate-400 rounded-xl bg-slate-800/30 border border-slate-700/50">
          <p className="text-lg">Your watchlist is empty.</p>
          <p className="mt-2">Add movies from the home page by clicking the clock icon.</p>
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
