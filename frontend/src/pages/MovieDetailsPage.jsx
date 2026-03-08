import { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMovieDetails,
  fetchTVDetails,
  clearMovieDetails,
} from '../store/slices/moviesSlice';
import { addFavorite, removeFavorite } from '../store/slices/favoritesSlice';
import { addToWatchlist, removeFromWatchlist } from '../store/slices/watchlistSlice';
import { addToHistory } from '../store/slices/historySlice';
import { openTrailerModal } from '../store/slices/uiSlice';

const POSTER_BASE = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE = 'https://image.tmdb.org/t/p/original';
const PLACEHOLDER = 'https://via.placeholder.com/500x750/334155/94a3b8?text=No+Image';

export default function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isTV = location.state?.isTV;
  const { currentMovie } = useSelector((s) => s.movies);
  const { isAuthenticated } = useSelector((s) => s.auth);
  const favorites = useSelector((s) => s.favorites.items);
  const watchlist = useSelector((s) => s.watchlist.items);

  const isFavorite = favorites.some((f) => String(f.movieId) === String(id));
  const isInWatchlist = watchlist.some((w) => String(w.movieId) === String(id));

  useEffect(() => {
    if (isTV) {
      dispatch(fetchTVDetails(id));
    } else {
      dispatch(fetchMovieDetails(id));
    }
    return () => dispatch(clearMovieDetails());
  }, [id, isTV, dispatch]);

  useEffect(() => {
    if (currentMovie && isAuthenticated) {
      dispatch(
        addToHistory({
          id: currentMovie.id,
          title: currentMovie.title || currentMovie.name,
          poster_path: currentMovie.poster_path,
        })
      );
    }
  }, [currentMovie?.id, isAuthenticated]);

  const handleTrailer = () => {
    dispatch(openTrailerModal({ id, isTV }));
  };

  const toggleFavorite = () => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }
    isFavorite ? dispatch(removeFavorite(id)) : dispatch(addFavorite(currentMovie));
  };

  const toggleWatchlist = () => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }
    isInWatchlist ? dispatch(removeFromWatchlist(id)) : dispatch(addToWatchlist(currentMovie));
  };

  if (!currentMovie) {
    return (
      <div className="flex justify-center py-24">
        <div className="animate-spin w-12 h-12 border-2 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const title = currentMovie.title || currentMovie.name;
  const poster = currentMovie.poster_url
    ? currentMovie.poster_url
    : currentMovie.poster_path
      ? `${POSTER_BASE}${currentMovie.poster_path}`
      : PLACEHOLDER;
  const backdrop = currentMovie.backdrop_path
    ? `${BACKDROP_BASE}${currentMovie.backdrop_path}`
    : null;
  const overview = currentMovie.overview || 'Description not available';

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 mb-6 sm:mb-8">
        {backdrop && (
          <div className="absolute inset-0">
            <img src={backdrop} alt="" className="w-full h-48 sm:h-64 md:h-80 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-slate-950/60" />
          </div>
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm sm:text-base"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
            <img
              src={poster}
              alt={title}
              className="w-40 sm:w-48 md:w-56 rounded-xl shadow-2xl object-cover flex-shrink-0 aspect-[2/3]"
              onError={(e) => {
                e.target.src = PLACEHOLDER;
              }}
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                {title}
              </h1>
              {currentMovie.tagline && (
                <p className="text-slate-400 italic mb-3 sm:mb-4 text-sm sm:text-base">{currentMovie.tagline}</p>
              )}
              <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                {(currentMovie.release_date || currentMovie.first_air_date) && (
                  <span className="px-2 sm:px-3 py-1 rounded-full bg-slate-700 text-slate-300 text-xs sm:text-sm">
                    {(currentMovie.release_date || currentMovie.first_air_date).slice(0, 4)}
                  </span>
                )}
                {currentMovie.vote_average > 0 && (
                  <span className="px-2 sm:px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs sm:text-sm">
                    ★ {currentMovie.vote_average.toFixed(1)}
                  </span>
                )}
                {currentMovie.runtime && (
                  <span className="px-2 sm:px-3 py-1 rounded-full bg-slate-700 text-slate-300 text-xs sm:text-sm">
                    {currentMovie.runtime} min
                  </span>
                )}
                {currentMovie.genre && (
                  <span className="px-2 sm:px-3 py-1 rounded-full bg-slate-700 text-slate-300 text-xs sm:text-sm">
                    {currentMovie.genre}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                <button
                  onClick={handleTrailer}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-900 font-medium transition-colors text-sm"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch Trailer
                </button>
                {isAuthenticated && (
                  <>
                    <button
                      onClick={toggleFavorite}
                      className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm ${
                        isFavorite ? 'bg-rose-500 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'
                      }`}
                    >
                      {isFavorite ? '❤️ Favorited' : '🤍 Favorites'}
                    </button>
                    <button
                      onClick={toggleWatchlist}
                      className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm ${
                        isInWatchlist ? 'bg-emerald-500 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'
                      }`}
                    >
                      {isInWatchlist ? '✓ Watchlist' : '+ Watchlist'}
                    </button>
                  </>
                )}
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-white mb-2">Overview</h2>
                <p className="text-slate-400 leading-relaxed text-sm sm:text-base">{overview}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
