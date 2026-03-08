import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from './store/slices/authSlice';
import { fetchFavorites } from './store/slices/favoritesSlice';
import { fetchWatchlist } from './store/slices/watchlistSlice';
import { fetchHistory } from './store/slices/historySlice';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import FavoritesPage from './pages/FavoritesPage';
import WatchlistPage from './pages/WatchlistPage';
import HistoryPage from './pages/HistoryPage';
import AdminPage from './pages/AdminPage';
import PersonPage from './pages/PersonPage';

function AuthGuard() {
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector((s) => s.auth);

  useEffect(() => {
    const init = async () => {
      if (token) {
        await dispatch(fetchProfile());
      }
    };
    init();
  }, [token]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchFavorites());
      dispatch(fetchWatchlist());
      dispatch(fetchHistory());
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleLogout = () => {
      window.location.href = '/';
    };
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  return null;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="auth" element={<AuthPage />} />
        <Route path="auth/login" element={<AuthPage />} />
        <Route path="auth/register" element={<AuthPage />} />
        <Route path="movie/:id" element={<MovieDetailsPage />} />
        <Route path="person/:id" element={<PersonPage />} />
        <Route
          path="favorites"
          element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="watchlist"
          element={
            <ProtectedRoute>
              <WatchlistPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="history"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthGuard />
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}
