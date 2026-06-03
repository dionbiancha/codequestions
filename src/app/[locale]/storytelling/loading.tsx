export default function Loading() {
  return (
    <div className="skeleton-delayed"><div className="max-w-3xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-8 bg-dark-border rounded w-44 mb-3" />
      <div className="h-4 bg-dark-border rounded w-80 mb-12" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-36 bg-dark-surface border border-dark-border rounded-xl" />
        ))}
      </div>
      <div className="bg-dark-surface border border-dark-border rounded-xl h-48 mb-12" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-dark-surface border border-dark-border rounded-xl" />
        ))}
      </div>
    </div></div>
  )
}
