export default function Loading() {
  return (
    <div className="skeleton-delayed"><div className="max-w-3xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-8 bg-dark-border rounded w-40 mb-3" />
      <div className="space-y-2 mt-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-4 bg-dark-border rounded" style={{ width: `${85 - i * 5}%` }} />
        ))}
      </div>
    </div></div>
  )
}
