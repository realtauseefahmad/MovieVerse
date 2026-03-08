export default function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden bg-slate-700/40 animate-pulse border border-slate-600/30">
      <div className="aspect-[2/3] w-full bg-slate-600/50" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-slate-600/50 rounded w-3/4" />
        <div className="h-3 bg-slate-600/40 rounded w-1/3" />
      </div>
    </div>
  );
}

export function SkeletonRow({ count = 5 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
