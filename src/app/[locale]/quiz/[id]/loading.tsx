export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-3 bg-dark-border rounded w-1/4 mb-8" />
      <div className="flex gap-1 mb-8">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-1.5 flex-1 bg-dark-border rounded-full" />
        ))}
      </div>
      <div className="h-6 bg-dark-border rounded w-3/4 mb-4" />
      <div className="h-4 bg-dark-border rounded w-1/2" />
    </div>
  )
}
