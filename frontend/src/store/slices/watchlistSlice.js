import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { watchlistAPI } from '../../lib/api';

export const fetchWatchlist = createAsyncThunk(
  'watchlist/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await watchlistAPI.getAll();
      return res.data.watchlist;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch watchlist');
    }
  }
);

export const addToWatchlist = createAsyncThunk(
  'watchlist/add',
  async (movie, { rejectWithValue }) => {
    try {
      const res = await watchlistAPI.add({
        movieId: movie.id,
        title: movie.title || movie.name,
        poster: movie.poster_url || (movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null),
      });
      return res.data.watchlist;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add to watchlist');
    }
  }
);

export const removeFromWatchlist = createAsyncThunk(
  'watchlist/remove',
  async (movieId, { rejectWithValue }) => {
    try {
      await watchlistAPI.remove(movieId);
      return movieId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to remove from watchlist');
    }
  }
);

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWatchlist.fulfilled, (state, { payload }) => {
        state.items = payload || [];
      })
      .addCase(addToWatchlist.fulfilled, (state, { payload }) => {
        state.items = [payload, ...state.items];
      })
      .addCase(removeFromWatchlist.fulfilled, (state, { payload }) => {
        state.items = state.items.filter((w) => String(w.movieId) !== String(payload));
      });
  },
});

export default watchlistSlice.reducer;
