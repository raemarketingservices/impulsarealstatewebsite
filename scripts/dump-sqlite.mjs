import { DatabaseSync } from 'node:sqlite'
import { writeFileSync, mkdirSync } from 'node:fs'

const db = new DatabaseSync('./db/custom.db')
const tables = ['Agent', 'Property', 'Setting', 'Testimonial', 'SocialPost', 'Inquiry', 'Goal', 'User']
mkdirSync('./scripts/dump', { recursive: true })

for (const t of tables) {
  try {
    const rows = db.prepare(`SELECT * FROM "${t}"`).all()
    writeFileSync(`./scripts/dump/${t}.json`, JSON.stringify(rows, null, 2))
    console.log(`${t}: ${rows.length} rows`)
  } catch (e) {
    console.log(`${t}: ERROR ${e.message}`)
  }
}
const settings = db.prepare('SELECT * FROM "Setting"').all()
console.log('SETTINGS KEYS:', settings.map((s) => s.key).join(', '))