export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-8 bg-dark-border rounded w-44 mb-3" />
      <div className="h-4 bg-dark-border rounded w-72 mb-10" />
      <div className="flex flex-col gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-dark-surface border border-dark-border rounded-lg p-6">
            <div className="flex gap-3 mb-3">
              <div className="h-5 bg-dark-border rounded w-14" />
              <div className="h-5 bg-dark-border rounded w-24" />
            </div>
            <div className="h-5 bg-dark-border rounded w-64 mb-4" />
            <div className="space-y-2">
              <div className="h-3 bg-dark-border rounded w-full" />
              <div className="h-3 bg-dark-border rounded w-5/6" />
              <div className="h-3 bg-dark-border rounded w-4/6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
