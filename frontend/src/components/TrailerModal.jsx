import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeTrailerModal } from '../store/slices/uiSlice';
import { clearTrailer, fetchTrailer } from '../store/slices/moviesSlice';

export default function TrailerModal() {
  const dispatch = useDispatch();
  const { trailerModalOpen, trailerMovieId, trailerIsTV } = useSelector((s) => s.ui);
  const { trailerKey, trailerError } = useSelector((s) => s.movies);

  const handleClose = () => {
    dispatch(closeTrailerModal());
    dispatch(clearTrailer());
  };

  useEffect(() => {
    if (trailerModalOpen && trailerMovieId) {
      dispatch(fetchTrailer({ id: trailerMovieId, isTV: trailerIsTV }));
    }
  }, [trailerModalOpen, trailerMovieId, trailerIsTV]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    if (trailerModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [trailerModalOpen]);

  if (!trailerModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-4xl aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {trailerError ? (
          <div className="flex items-center justify-center h-full text-slate-300 p-8 text-center">
            <p className="text-lg">Trailer for this movie is currently unavailable.</p>
          </div>
        ) : trailerKey ? (
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
            title="Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p>Loading trailer...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
