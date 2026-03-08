import { useState, useCallback } from 'react';

export default function SearchBar({ value, onChange, placeholder = 'Search movies...' }) {
  const [localValue, setLocalValue] = useState(value || '');

  const handleChange = useCallback(
    (e) => {
      const v = e.target.value;
      setLocalValue(v);
      onChange?.(v);
    },
    [onChange]
  );

  return (
    <div className="relative">
      <input
        type="search"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
      />
      {localValue && (
        <button
          onClick={() => {
            setLocalValue('');
            onChange?.('');
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
