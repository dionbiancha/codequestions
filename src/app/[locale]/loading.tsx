export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse">
      <div className="text-center mb-24 pt-8">
        <div className="h-6 bg-dark-border rounded-full w-32 mx-auto mb-8" />
        <div className="h-14 bg-dark-border rounded w-72 mx-auto mb-6" />
        <div className="h-4 bg-dark-border rounded w-64 mx-auto mb-3" />
        <div className="h-4 bg-dark-border rounded w-48 mx-auto mb-10" />
        <div className="flex justify-center gap-4">
          <div className="h-11 bg-dark-surface border border-dark-border rounded-lg w-32" />
          <div className="h-11 bg-dark-surface border border-dark-border rounded-lg w-28" />
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-px bg-dark-border rounded-xl overflow-hidden border border-dark-border mb-24">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-dark-bg p-8 h-40" />
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-2 mb-24">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-7 bg-dark-surface border border-dark-border rounded-full w-20" />
        ))}
      </div>
    </div>
  )
}
