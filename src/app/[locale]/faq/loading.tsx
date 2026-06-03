export default function Loading() {
  return (
    <div className="skeleton-delayed"><div className="max-w-3xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-8 bg-dark-border rounded w-32 mb-10" />
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <div className="h-5 bg-dark-border rounded w-56 mb-2" />
            <div className="h-4 bg-dark-border rounded w-full mb-1" />
            <div className="h-4 bg-dark-border rounded w-4/5" />
          </div>
        ))}
      </div>
    </div></div>
  )
}
