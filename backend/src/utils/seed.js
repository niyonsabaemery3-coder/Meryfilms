import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import { User } from '../models/User.js'
import { Category } from '../models/Category.js'
import { Narrator } from '../models/Narrator.js'

const DEFAULT_CATEGORIES = [
  { slug: 'technology', label: '🚀 Technology' },
  { slug: 'funny', label: '😂 Funny' },
  { slug: 'horror', label: '😱 Horror' },
  { slug: 'romance', label: '❤️ Romance' },
  { slug: 'action', label: '🔥 Action' },
  { slug: 'mystery', label: '🧠 Mystery' },
]

const DEFAULT_NARRATORS = [
  { slug: 'moses', name: 'Moses' },
  { slug: 'sankara-da', name: 'Sankara Da' },
]

/**
 * Idempotent: safe to run on every boot. Only creates what's missing,
 * never overwrites data an admin has already changed.
 */
export async function seedDatabase(logger = console) {
  const email = (process.env.ADMIN_EMAIL || 'admin@meryfilms.rw').toLowerCase().trim()
  const password = process.env.ADMIN_PASSWORD || 'MeryFilms@2026'
  const name = process.env.ADMIN_NAME || 'MeryFilms Admin'

  const existingAdmin = await User.findOne({ email })
  if (!existingAdmin) {
    const passwordHash = await User.hashPassword(password)
    await User.create({ name, email, passwordHash, role: 'admin' })
    logger.info(`Seeded demo admin account: ${email}`)
  }

  for (const cat of DEFAULT_CATEGORIES) {
    await Category.updateOne({ slug: cat.slug }, { $setOnInsert: cat }, { upsert: true })
  }

  for (const nar of DEFAULT_NARRATORS) {
    await Narrator.updateOne({ slug: nar.slug }, { $setOnInsert: nar }, { upsert: true })
  }
}

// Allow running directly: `npm run seed`
if (import.meta.url === `file://${process.argv[1]}`) {
  const conn = await connectDB(console)
  await seedDatabase(console)
  await mongoose.disconnect()
  console.log('Seed complete.')
  process.exit(0)
}
