import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites } from '../store/slices/favoritesSlice';
import MovieCard from '../components/MovieCard';

export default function FavoritesPage() {
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.favorites);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const movies = items.map((f) => ({
    id: f.movieId,
    title: f.title,
    poster_path: f.poster ? null : null,
    poster: f.poster,
  }));

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">My Favorites</h1>
      <p className="text-slate-400 mb-8">Movies you've added to your favorites</p>

      {items.length === 0 ? (
        <div className="text-center py-16 text-slate-400 rounded-xl bg-slate-800/30 border border-slate-700/50">
          <p className="text-lg">No favorites yet.</p>
          <p className="mt-2">Add movies from the home page by clicking the heart icon.</p>
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
