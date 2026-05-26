type BadgeProps = {
  children: React.ReactNode
  variant?: 'blue' | 'green' | 'orange' | 'gray'
}

const variants = {
  blue:   'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  green:  'bg-green-500/10 text-green-400 border border-green-500/20',
  orange: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
  gray:   'bg-gray-500/10 text-gray-500 dark:text-gray-400 border border-gray-500/20',
}

export function Badge({ children, variant = 'gray' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono ${variants[variant]}`}>
      {children}
    </span>
  )
}
