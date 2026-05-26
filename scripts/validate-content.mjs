import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CONTENT_DIR = path.join(__dirname, '..', 'src', 'content')
const REQUIRED_FIELDS = ['title', 'category', 'subcategory', 'tags', 'difficulty', 'lang']
const VALID_DIFFICULTIES = ['beginner', 'intermediate', 'advanced']
const VALID_LANGS = ['en', 'pt']
const REQUIRED_SECTIONS = ['## Full Answer', '## Quick Answer', '## Flashcard']

let errors = 0

function walk(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).flatMap(f => {
    const full = path.join(dir, f)
    return fs.statSync(full).isDirectory() ? walk(full) : [full]
  })
}

const files = walk(CONTENT_DIR).filter(f => f.endsWith('.md'))

for (const file of files) {
  const raw = fs.readFileSync(file, 'utf-8')
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/)
  const rel = path.relative(CONTENT_DIR, file)

  if (!fmMatch) {
    console.error(`❌ ${rel}: missing frontmatter`)
    errors++
    continue
  }

  const fm = Object.fromEntries(
    fmMatch[1].split('\n')
      .map(line => line.match(/^(\w[\w-]*):\s*(.+)$/))
      .filter(Boolean)
      .map(([, k, v]) => [k, v.replace(/^["']|["']$/g, '')])
  )

  for (const field of REQUIRED_FIELDS) {
    if (!fm[field]) {
      console.error(`❌ ${rel}: missing required field "${field}"`)
      errors++
    }
  }

  if (fm.difficulty && !VALID_DIFFICULTIES.includes(fm.difficulty)) {
    console.error(`❌ ${rel}: invalid difficulty "${fm.difficulty}"`)
    errors++
  }

  if (fm.lang && !VALID_LANGS.includes(fm.lang)) {
    console.error(`❌ ${rel}: invalid lang "${fm.lang}"`)
    errors++
  }

  for (const section of REQUIRED_SECTIONS) {
    if (!raw.includes(section)) {
      console.error(`❌ ${rel}: missing section "${section}"`)
      errors++
    }
  }
}

if (errors > 0) {
  console.error(`\n${errors} validation error(s) found.`)
  process.exit(1)
} else {
  console.log(`✅ All ${files.length} content files validated.`)
}
