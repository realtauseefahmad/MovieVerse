import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTrending,
  fetchPopular,
  fetchTVTrending,
  fetchTVPopular,
  searchMulti,
  clearSearch,
} from '../store/slices/moviesSlice';
import { useDebounce } from '../hooks/useDebounce';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import { SkeletonRow } from '../components/SkeletonCard';

export default function HomePage() {
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 400);

  const {
    trending,
    popular,
    tvTrending,
    tvPopular,
    searchResults,
    searchQuery,
    trendingPage,
    popularPage,
    tvTrendingPage,
    tvPopularPage,
    searchPage,
    totalPages,
    loading,
    searchLoading,
  } = useSelector((s) => s.movies);

  const isSearchMode = !!debouncedSearch.trim();
  const hasMoreSearch = searchPage < totalPages;

  useEffect(() => {
    if (!isSearchMode) {
      dispatch(clearSearch());
      dispatch(fetchTrending(1));
      dispatch(fetchPopular(1));
      dispatch(fetchTVTrending(1));
      dispatch(fetchTVPopular(1));
    } else {
      dispatch(searchMulti({ query: debouncedSearch, page: 1 }));
    }
  }, [debouncedSearch]);

  const loadMoreSearch = useCallback(() => {
    if (isSearchMode && hasMoreSearch && !searchLoading) {
      dispatch(searchMulti({ query: debouncedSearch, page: searchPage + 1 }));
    }
  }, [isSearchMode, hasMoreSearch, searchLoading, debouncedSearch, searchPage, dispatch]);

  const sentinelRef = useInfiniteScroll(loadMoreSearch, hasMoreSearch, searchLoading);

  const loadMoreTrending = useCallback(() => {
    if (!searchLoading && trendingPage < totalPages) dispatch(fetchTrending(trendingPage + 1));
  }, [trendingPage, totalPages, searchLoading, dispatch]);

  const loadMorePopular = useCallback(() => {
    dispatch(fetchPopular(popularPage + 1));
  }, [popularPage, dispatch]);

  const loadMoreTVTrending = useCallback(() => {
    dispatch(fetchTVTrending(tvTrendingPage + 1));
  }, [tvTrendingPage, dispatch]);

  const loadMoreTVPopular = useCallback(() => {
    dispatch(fetchTVPopular(tvPopularPage + 1));
  }, [tvPopularPage, dispatch]);

  if (isSearchMode) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <section>
          <h1 className="text-2xl sm:text-3xl font-bold text-white dark:text-white mb-2">
            Search: &quot;{searchQuery}&quot;
          </h1>
          <p className="text-slate-400 mb-4 sm:mb-6 text-sm sm:text-base">
            Movies, TV shows & people
          </p>
          <div className="max-w-xl mb-6 sm:mb-8">
            <SearchBar value={searchInput} onChange={setSearchInput} />
          </div>
        </section>

        {searchLoading && !searchResults.length ? (
          <SkeletonRow count={6} />
        ) : searchResults.length === 0 ? (
          <div className="text-center py-12 sm:py-16 text-slate-400">
            <p className="text-base sm:text-lg">No results found.</p>
            <p className="mt-2 text-sm">Try a different search term.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {searchResults.map((item) => (
                <MovieCard key={`${item.media_type}-${item.id}`} movie={item} />
              ))}
            </div>
            <div ref={sentinelRef} className="h-4" />
            {searchLoading && searchResults.length > 0 && (
              <div className="flex justify-center py-6">
                <div className="animate-spin w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full" />
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-10 sm:space-y-12">
      <section>
        <h1 className="text-2xl sm:text-3xl font-bold text-white dark:text-white mb-2">
          Discover
        </h1>
        <p className="text-slate-400 mb-4 sm:mb-6 text-sm sm:text-base">
          Search movies, TV shows & people
        </p>
        <div className="max-w-xl mb-6 sm:mb-8">
          <SearchBar value={searchInput} onChange={setSearchInput} placeholder="Search movies, TV, actors..." />
        </div>
      </section>

      {/* Trending Movies */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-white dark:text-white mb-4">Trending Movies</h2>
        {loading && !trending.length ? (
          <SkeletonRow count={5} />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {trending.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
            {trendingPage < totalPages && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={loadMoreTrending}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 disabled:opacity-50 text-sm font-medium"
                >
                  {loading ? 'Loading...' : 'Load more'}
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Popular Movies */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-white dark:text-white mb-4">Popular Movies</h2>
        {!popular.length && !loading ? (
          <SkeletonRow count={5} />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {popular.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
            <div className="flex justify-center mt-6">
              <button
                onClick={loadMorePopular}
                className="px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 text-sm font-medium"
              >
                Load more
              </button>
            </div>
          </>
        )}
      </section>

      {/* Trending TV */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-white dark:text-white mb-4">Trending TV Shows</h2>
        {!tvTrending.length && loading ? (
          <SkeletonRow count={5} />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {tvTrending.map((show) => (
                <MovieCard key={show.id} movie={show} isTV />
              ))}
            </div>
            <div className="flex justify-center mt-6">
              <button
                onClick={loadMoreTVTrending}
                className="px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 text-sm font-medium"
              >
                Load more
              </button>
            </div>
          </>
        )}
      </section>

      {/* Popular TV */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-white dark:text-white mb-4">Popular TV Shows</h2>
        {!tvPopular.length && !loading ? (
          <SkeletonRow count={5} />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {tvPopular.map((show) => (
                <MovieCard key={show.id} movie={show} isTV />
              ))}
            </div>
            <div className="flex justify-center mt-6">
              <button
                onClick={loadMoreTVPopular}
                className="px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 text-sm font-medium"
              >
                Load more
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
