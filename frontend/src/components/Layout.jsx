import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import TrailerModal from './TrailerModal';

export default function Layout() {
  const theme = useSelector((s) => s.theme.mode);
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-500 text-slate-900'}`}>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>
      <TrailerModal />
    </div>
  );
}
