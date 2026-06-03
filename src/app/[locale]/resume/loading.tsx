export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-8 bg-dark-border rounded w-40 mb-3" />
      <div className="h-4 bg-dark-border rounded w-72 mb-12" />
      <div className="space-y-3 mb-12">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-dark-surface border border-dark-border rounded-xl" />
        ))}
      </div>
      <div className="bg-dark-surface border border-dark-border rounded-xl h-32 mb-12" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-dark-surface border border-dark-border rounded-xl" />
        ))}
      </div>
    </div>
  )
}
