export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-8 bg-dark-border rounded w-44 mb-10" />
      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-4 bg-dark-border rounded" style={{ width: `${90 - i * 3}%` }} />
        ))}
      </div>
    </div>
  )
}
