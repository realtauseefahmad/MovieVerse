import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { historyAPI } from '../../lib/api';

export const fetchHistory = createAsyncThunk(
  'history/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await historyAPI.getAll();
      return res.data.history;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch history');
    }
  }
);

export const addToHistory = createAsyncThunk(
  'history/add',
  async (movie, { rejectWithValue }) => {
    try {
      const res = await historyAPI.add({
        movieId: String(movie.id),
        title: movie.title || movie.name,
        poster: movie.poster_url || (movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null),
      });
      return res.data.history;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add to history');
    }
  }
);

const historySlice = createSlice({
  name: 'history',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.fulfilled, (state, { payload }) => {
        state.items = payload || [];
      })
      .addCase(addToHistory.fulfilled, (state, { payload }) => {
        state.items = [payload, ...state.items.filter((h) => h.movieId !== payload.movieId)];
      });
  },
});

export default historySlice.reducer;
