type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md'
}

const variants = {
  primary:   'bg-blue-600 hover:bg-blue-500 text-white',
  secondary: 'bg-white dark:bg-dark-surface border border-gray-300 dark:border-dark-border text-gray-700 dark:text-dark-text hover:border-blue-500/50',
  ghost:     'text-gray-500 dark:text-dark-muted hover:text-gray-900 dark:hover:text-dark-heading',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded font-medium transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  )
}
