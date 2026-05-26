import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0d1117',
          surface: '#161b22',
          border: '#30363d',
          text: '#c9d1d9',
          heading: '#f0f6fc',
          muted: '#8b949e',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
