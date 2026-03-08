import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import moviesReducer from './slices/moviesSlice';
import favoritesReducer from './slices/favoritesSlice';
import watchlistReducer from './slices/watchlistSlice';
import historyReducer from './slices/historySlice';
import uiReducer from './slices/uiSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: moviesReducer,
    favorites: favoritesReducer,
    watchlist: watchlistReducer,
    history: historyReducer,
    ui: uiReducer,
    theme: themeReducer,
  },
});
