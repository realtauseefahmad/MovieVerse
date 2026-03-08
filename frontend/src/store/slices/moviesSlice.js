import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { moviesAPI } from '../../lib/api';

export const fetchTrending = createAsyncThunk(
  'movies/fetchTrending',
  async (page = 1, { rejectWithValue }) => {
    try {
      const res = await moviesAPI.getTrending(page);
      return { movies: res.data.movies, page: res.data.page, totalPages: res.data.total_pages };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch');
    }
  }
);

export const fetchPopular = createAsyncThunk(
  'movies/fetchPopular',
  async (page = 1, { rejectWithValue }) => {
    try {
      const res = await moviesAPI.getPopular(page);
      return { movies: res.data.movies, page: res.data.page, totalPages: res.data.total_pages };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch');
    }
  }
);

export const fetchTVTrending = createAsyncThunk(
  'movies/fetchTVTrending',
  async (page = 1, { rejectWithValue }) => {
    try {
      const res = await moviesAPI.getTVTrending(page);
      return { results: res.data.results, page: res.data.page, totalPages: res.data.total_pages };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch');
    }
  }
);

export const fetchTVPopular = createAsyncThunk(
  'movies/fetchTVPopular',
  async (page = 1, { rejectWithValue }) => {
    try {
      const res = await moviesAPI.getTVPopular(page);
      return { results: res.data.results, page: res.data.page, totalPages: res.data.total_pages };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch');
    }
  }
);

export const searchMovies = createAsyncThunk(
  'movies/search',
  async ({ query, page = 1 }, { rejectWithValue }) => {
    try {
      const res = await moviesAPI.search(query, page);
      return {
        results: res.data.results,
        page: res.data.page,
        totalPages: res.data.total_pages,
        query,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Search failed');
    }
  }
);

export const searchMulti = createAsyncThunk(
  'movies/searchMulti',
  async ({ query, page = 1 }, { rejectWithValue }) => {
    try {
      const res = await moviesAPI.searchMulti(query, page);
      return {
        results: res.data.results,
        page: res.data.page,
        totalPages: res.data.total_pages,
        query,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Search failed');
    }
  }
);

export const fetchMovieDetails = createAsyncThunk(
  'movies/fetchDetails',
  async (id, { rejectWithValue }) => {
    try {
      const res = await moviesAPI.getDetails(id);
      return res.data.movie;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch details');
    }
  }
);

export const fetchTVDetails = createAsyncThunk(
  'movies/fetchTVDetails',
  async (id, { rejectWithValue }) => {
    try {
      const res = await moviesAPI.getTVDetails(id);
      return res.data.movie;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch details');
    }
  }
);

export const fetchTrailer = createAsyncThunk(
  'movies/fetchTrailer',
  async ({ id, isTV = false }, { rejectWithValue }) => {
    try {
      const res = isTV ? await moviesAPI.getTVTrailer(id) : await moviesAPI.getTrailer(id);
      return res.data.trailerKey;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Trailer not found');
    }
  }
);

const initialState = {
  trending: [],
  popular: [],
  tvTrending: [],
  tvPopular: [],
  searchResults: [],
  searchQuery: '',
  currentMovie: null,
  trailerKey: null,
  trailerError: null,
  trendingPage: 1,
  popularPage: 1,
  tvTrendingPage: 1,
  tvPopularPage: 1,
  searchPage: 1,
  totalPages: 1,
  loading: false,
  searchLoading: false,
  error: null,
};

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    clearSearch: (state) => {
      state.searchResults = [];
      state.searchQuery = '';
      state.searchPage = 1;
    },
    clearMovieDetails: (state) => {
      state.currentMovie = null;
    },
    clearTrailer: (state) => {
      state.trailerKey = null;
      state.trailerError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrending.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTrending.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.trending = payload.page === 1 ? payload.movies : [...state.trending, ...payload.movies];
        state.trendingPage = payload.page;
        state.totalPages = payload.totalPages || 1;
      })
      .addCase(fetchTrending.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
      .addCase(fetchPopular.fulfilled, (state, { payload }) => {
        state.popular = payload.page === 1 ? payload.movies : [...state.popular, ...payload.movies];
        state.popularPage = payload.page;
      })
      .addCase(fetchTVTrending.fulfilled, (state, { payload }) => {
        state.tvTrending = payload.page === 1 ? payload.results : [...state.tvTrending, ...payload.results];
        state.tvTrendingPage = payload.page;
      })
      .addCase(fetchTVPopular.fulfilled, (state, { payload }) => {
        state.tvPopular = payload.page === 1 ? payload.results : [...state.tvPopular, ...payload.results];
        state.tvPopularPage = payload.page;
      })
      .addCase(searchMovies.pending, (state) => { state.searchLoading = true; state.error = null; })
      .addCase(searchMovies.fulfilled, (state, { payload }) => {
        state.searchLoading = false;
        state.searchResults = payload.page === 1 ? payload.results : [...state.searchResults, ...payload.results];
        state.searchPage = payload.page;
        state.searchQuery = payload.query;
        state.totalPages = payload.totalPages || 1;
      })
      .addCase(searchMovies.rejected, (state, { payload }) => { state.searchLoading = false; state.error = payload; })
      .addCase(searchMulti.pending, (state) => { state.searchLoading = true; state.error = null; })
      .addCase(searchMulti.fulfilled, (state, { payload }) => {
        state.searchLoading = false;
        state.searchResults = payload.page === 1 ? payload.results : [...state.searchResults, ...payload.results];
        state.searchPage = payload.page;
        state.searchQuery = payload.query;
        state.totalPages = payload.totalPages || 1;
      })
      .addCase(searchMulti.rejected, (state, { payload }) => { state.searchLoading = false; state.error = payload; })
      .addCase(fetchMovieDetails.fulfilled, (state, { payload }) => { state.currentMovie = payload; })
      .addCase(fetchTVDetails.fulfilled, (state, { payload }) => { state.currentMovie = payload; })
      .addCase(fetchTrailer.fulfilled, (state, { payload }) => {
        state.trailerKey = payload;
        state.trailerError = null;
      })
      .addCase(fetchTrailer.rejected, (state, { payload }) => {
        state.trailerKey = null;
        state.trailerError = payload || 'Trailer for this movie is currently unavailable.';
      });
  },
});

export const { clearSearch, clearMovieDetails, clearTrailer } = moviesSlice.actions;
export default moviesSlice.reducer;
