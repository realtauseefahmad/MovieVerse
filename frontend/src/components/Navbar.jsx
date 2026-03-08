import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { toggleTheme } from '../store/slices/themeSlice';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const theme = useSelector((s) => s.theme.mode);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setMenuOpen(false);
  };

  const navLinks = (
    <>
      <Link to="/" onClick={() => setMenuOpen(false)} className="text-slate-300 hover:text-amber-400 transition-colors text-sm lg:text-base">
        Home
      </Link>
      {isAuthenticated && (
        <>
          <Link to="/favorites" onClick={() => setMenuOpen(false)} className="text-slate-300 hover:text-amber-400 transition-colors text-sm lg:text-base">
            Favorites
          </Link>
          <Link to="/watchlist" onClick={() => setMenuOpen(false)} className="text-slate-300 hover:text-amber-400 transition-colors text-sm lg:text-base">
            Watchlist
          </Link>
          <Link to="/history" onClick={() => setMenuOpen(false)} className="text-slate-300 hover:text-amber-400 transition-colors text-sm lg:text-base">
            History
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-slate-300 hover:text-amber-400 transition-colors text-sm lg:text-base">
              Admin
            </Link>
          )}
        </>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/80 border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link to="/" className="flex items-center gap-2 text-lg sm:text-xl font-bold text-amber-400">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
              <span className="text-slate-900 font-black">M</span>
            </div>
            <span className="hidden sm:inline">MovieVerse</span>
          </Link>

          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {navLinks}
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="md:hidden p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-white"
              aria-label="Menu"
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-amber-400 transition-colors"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            {isAuthenticated ? (
              <>
                <span className="text-slate-400 text-xs sm:text-sm hidden sm:inline truncate max-w-[100px] lg:max-w-none">{user?.username}</span>
                <button
                  onClick={handleLogout}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs sm:text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-slate-300 hover:text-white text-xs sm:text-sm transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-900 font-medium text-xs sm:text-sm transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-200 ${menuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="py-3 flex flex-col gap-2 border-t border-slate-700/50">
            {navLinks}
          </div>
        </div>
      </div>
    </nav>
  );
}
