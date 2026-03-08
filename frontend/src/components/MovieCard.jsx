import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../store/slices/favoritesSlice';
import { addToWatchlist, removeFromWatchlist } from '../store/slices/watchlistSlice';
import { addToHistory } from '../store/slices/historySlice';
import { openTrailerModal } from '../store/slices/uiSlice';

const POSTER_BASE = 'https://image.tmdb.org/t/p/w500';
const PLACEHOLDER = 'https://via.placeholder.com/500x750/334155/94a3b8?text=No+Image';

export default function MovieCard({ movie, isTV = false }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((s) => s.auth);
  const favorites = useSelector((s) => s.favorites.items);
  const watchlist = useSelector((s) => s.watchlist.items);

  const mediaType = movie.media_type || (isTV ? 'tv' : 'movie');
  const isPerson = mediaType === 'person';
  const title = movie.title || movie.name;
  const poster =
    movie.poster_url ||
    (movie.poster_path ? `${POSTER_BASE}${movie.poster_path}` : null) ||
    (movie.poster || null) ||
    (isPerson && movie.profile_path ? `${POSTER_BASE}${movie.profile_path}` : null) ||
    PLACEHOLDER;

  const isFavorite = !isPerson && favorites.some((f) => String(f.movieId) === String(movie.id));
  const isInWatchlist = !isPerson && watchlist.some((w) => String(w.movieId) === String(movie.id));

  const handleClick = () => {
    if (isPerson) {
      navigate(`/person/${movie.id}`);
      return;
    }
    if (isAuthenticated) dispatch(addToHistory(movie));
    navigate(`/movie/${movie.id}`, { state: { isTV: mediaType === 'tv' } });
  };

  const handleTrailer = (e) => {
    e.stopPropagation();
    if (isPerson) return;
    dispatch(openTrailerModal({ id: movie.id, isTV: mediaType === 'tv' }));
  };

  const toggleFavorite = (e) => {
    e.stopPropagation();
    if (isPerson) return;
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }
    isFavorite ? dispatch(removeFavorite(movie.id)) : dispatch(addFavorite(movie));
  };

  const toggleWatchlist = (e) => {
    e.stopPropagation();
    if (isPerson) return;
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }
    isInWatchlist ? dispatch(removeFromWatchlist(movie.id)) : dispatch(addToWatchlist(movie));
  };

  return (
    <article
      onClick={handleClick}
      className="group relative rounded-xl overflow-hidden bg-slate-800/50 dark:bg-slate-800/50 border border-slate-700/50 hover:border-amber-500/50 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/10"
    >
      <div className="aspect-[2/3] relative overflow-hidden">
        <img
          src={poster}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src = PLACEHOLDER;
          }}
        />
        {!isPerson && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex gap-2 justify-center mb-2">
                <button
                  onClick={handleTrailer}
                  className="p-2 rounded-full bg-amber-500 hover:bg-amber-400 text-white transition-colors"
                  title="Watch trailer"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
                {isAuthenticated && (
                  <>
                    <button
                      onClick={toggleFavorite}
                      className={`p-2 rounded-full transition-colors ${
                        isFavorite ? 'bg-rose-500 text-white' : 'bg-white/20 hover:bg-rose-500/80 text-white'
                      }`}
                      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                    <button
                      onClick={toggleWatchlist}
                      className={`p-2 rounded-full transition-colors ${
                        isInWatchlist ? 'bg-emerald-500 text-white' : 'bg-white/20 hover:bg-emerald-500/80 text-white'
                      }`}
                      title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill={isInWatchlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          </>
        )}
        {!isPerson && movie.vote_average > 0 && (
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-500/90 text-white text-xs sm:text-sm font-semibold">
            {movie.vote_average?.toFixed(1)}
          </span>
        )}
      </div>
      <div className="p-2 sm:p-3">
        <h3 className="font-semibold text-white truncate text-sm sm:text-base">{title}</h3>
        {(movie.release_date || movie.first_air_date) && (
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            {(movie.release_date || movie.first_air_date)?.slice(0, 4)}
          </p>
        )}
        {isPerson && movie.known_for_department && (
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">{movie.known_for_department}</p>
        )}
      </div>
    </article>
  );
}
