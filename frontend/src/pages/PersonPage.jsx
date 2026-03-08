import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { moviesAPI } from '../lib/api';

const POSTER_BASE = 'https://image.tmdb.org/t/p/w500';
const PLACEHOLDER = 'https://via.placeholder.com/500x750/334155/94a3b8?text=No+Image';

export default function PersonPage() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    moviesAPI.getPersonDetails(id).then((res) => {
      if (!cancelled) {
        setPerson(res.data.person);
        setLoading(false);
      }
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="animate-spin w-12 h-12 border-2 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!person) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p>Person not found.</p>
      </div>
    );
  }

  const profile = person.profile_path
    ? `${POSTER_BASE}${person.profile_path}`
    : PLACEHOLDER;
  const bio = person.biography || 'Description not available';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
        <img
          src={profile}
          alt={person.name}
          className="w-48 sm:w-56 rounded-xl object-cover flex-shrink-0 aspect-[2/3]"
          onError={(e) => { e.target.src = PLACEHOLDER; }}
        />
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{person.name}</h1>
          {person.known_for_department && (
            <p className="text-amber-400 text-sm sm:text-base mb-4">{person.known_for_department}</p>
          )}
          {person.birthday && (
            <p className="text-slate-400 text-sm mb-2">Born: {person.birthday}</p>
          )}
          <h2 className="text-lg font-semibold text-white mt-4 mb-2">Biography</h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed whitespace-pre-line">{bio}</p>
        </div>
      </div>
    </div>
  );
}
