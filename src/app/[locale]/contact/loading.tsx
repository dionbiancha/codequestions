export default function Loading() {
  return (
    <div className="skeleton-delayed"><div className="max-w-2xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-8 bg-dark-border rounded w-32 mb-3" />
      <div className="h-4 bg-dark-border rounded w-72 mb-10" />
      <div className="flex flex-col gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-20 bg-dark-surface border border-dark-border rounded-lg" />
        ))}
      </div>
    </div></div>
  )
}
