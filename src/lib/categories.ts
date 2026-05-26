export type Category = {
  slug: string
  icon: string
  color: string
  borderColor: string
}

export const CATEGORIES: Category[] = [
  { slug: 'frontend',     icon: '⚛️',  color: 'text-blue-400',   borderColor: 'border-blue-500/30' },
  { slug: 'backend',      icon: '🖥️',  color: 'text-green-400',  borderColor: 'border-green-500/30' },
  { slug: 'devops',       icon: '🐳',  color: 'text-orange-400', borderColor: 'border-orange-500/30' },
  { slug: 'data',         icon: '📊',  color: 'text-purple-400', borderColor: 'border-purple-500/30' },
  { slug: 'soft-skills',  icon: '🗣️',  color: 'text-pink-400',   borderColor: 'border-pink-500/30' },
  { slug: 'architecture', icon: '🏗️',  color: 'text-yellow-400', borderColor: 'border-yellow-500/30' },
  { slug: 'security',     icon: '🔒',  color: 'text-red-400',    borderColor: 'border-red-500/30' },
]

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find(c => c.slug === slug)
}
