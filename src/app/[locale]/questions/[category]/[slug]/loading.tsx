export default function Loading() {
  return (
    <div className="skeleton-delayed"><div className="max-w-6xl mx-auto px-4 py-12 animate-pulse">
      <div className="flex items-center gap-2 mb-8">
        <div className="h-4 bg-dark-border rounded w-20" />
        <div className="h-4 bg-dark-border rounded w-4" />
        <div className="h-4 bg-dark-border rounded w-24" />
        <div className="h-4 bg-dark-border rounded w-4" />
        <div className="h-4 bg-dark-border rounded w-48" />
      </div>

      <div className="mb-8">
        <div className="h-8 bg-dark-border rounded w-3/4 mb-4" />
        <div className="flex gap-2">
          <div className="h-6 bg-dark-surface border border-dark-border rounded-full w-16" />
          <div className="h-6 bg-dark-surface border border-dark-border rounded-full w-20" />
          <div className="h-6 bg-dark-surface border border-dark-border rounded-full w-14" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <div className="h-3 bg-dark-border rounded w-24 mb-4" />
          <div className="bg-dark-surface border border-dark-border rounded-lg p-6 space-y-3">
            <div className="h-4 bg-dark-border rounded w-full" />
            <div className="h-4 bg-dark-border rounded w-5/6" />
            <div className="h-4 bg-dark-border rounded w-4/6" />
            <div className="h-4 bg-dark-border rounded w-full" />
            <div className="h-4 bg-dark-border rounded w-3/4" />
            <div className="h-20 bg-dark-border rounded w-full mt-4" />
            <div className="h-4 bg-dark-border rounded w-full" />
            <div className="h-4 bg-dark-border rounded w-2/3" />
          </div>
        </div>

        <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
          <div>
            <div className="h-3 bg-dark-border rounded w-24 mb-3" />
            <div className="bg-dark-surface border border-dark-border rounded-lg p-4 space-y-2">
              <div className="h-4 bg-dark-border rounded w-full" />
              <div className="h-4 bg-dark-border rounded w-4/5" />
              <div className="h-4 bg-dark-border rounded w-3/5" />
            </div>
          </div>
          <div className="bg-dark-surface border border-dark-border rounded-xl h-52" />
        </div>
      </div>
    </div></div>
  )
}
