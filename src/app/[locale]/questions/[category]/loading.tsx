export default function Loading() {
  return (
    <div className="skeleton-delayed"><div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-4 bg-dark-border rounded w-28 mb-8" />

      <div className="flex items-center gap-4 mb-10">
        <div className="w-10 h-10 bg-dark-border rounded-full" />
        <div className="h-8 bg-dark-border rounded w-40" />
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-7 bg-dark-surface border border-dark-border rounded-full w-20" />
        ))}
      </div>

      <div className="h-10 bg-dark-surface border border-dark-border rounded-lg mb-5" />

      <div className="flex flex-col gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-20 bg-dark-surface border border-dark-border rounded-lg" />
        ))}
      </div>
    </div></div>
  )
}
