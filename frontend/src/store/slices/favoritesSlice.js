import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { favoritesAPI } from '../../lib/api';

export const fetchFavorites = createAsyncThunk(
  'favorites/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await favoritesAPI.getAll();
      return res.data.favorites;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch favorites');
    }
  }
);

export const addFavorite = createAsyncThunk(
  'favorites/add',
  async (movie, { rejectWithValue }) => {
    try {
      const res = await favoritesAPI.add({
        movieId: movie.id,
        title: movie.title || movie.name,
        poster: movie.poster_url || (movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null),
      });
      return res.data.favorite;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add favorite');
    }
  }
);

export const removeFavorite = createAsyncThunk(
  'favorites/remove',
  async (movieId, { rejectWithValue }) => {
    try {
      await favoritesAPI.remove(movieId);
      return movieId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to remove favorite');
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.fulfilled, (state, { payload }) => {
        state.items = payload || [];
      })
      .addCase(addFavorite.fulfilled, (state, { payload }) => {
        state.items = [...state.items, payload];
      })
      .addCase(removeFavorite.fulfilled, (state, { payload }) => {
        state.items = state.items.filter((f) => String(f.movieId) !== String(payload));
      });
  },
});

export default favoritesSlice.reducer;
