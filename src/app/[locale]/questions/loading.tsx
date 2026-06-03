export default function Loading() {
  return (
    <div className="skeleton-delayed"><div className="max-w-5xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-9 bg-dark-border rounded w-48 mb-3" />
      <div className="h-4 bg-dark-border rounded w-64 mb-10" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-36 bg-dark-surface border border-dark-border rounded-lg" />
        ))}
      </div>
    </div></div>
  )
}
