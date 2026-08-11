import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import sensible from '@fastify/sensible'
import closeWithGrace from 'close-with-grace'

import { connectDB, disconnectDB } from './config/db.js'
import { seedDatabase } from './utils/seed.js'
import authPlugin from './plugins/auth.js'

import authRoutes from './routes/auth.js'
import movieRoutes from './routes/movies.js'
import categoryRoutes from './routes/categories.js'
import narratorRoutes from './routes/narrators.js'

const app = Fastify({
  logger:
    process.env.NODE_ENV === 'production'
      ? true
      : { transport: { target: 'pino-pretty', options: { translateTime: 'HH:MM:ss', ignore: 'pid,hostname' } } },
})

await app.register(helmet, { crossOriginResourcePolicy: { policy: 'cross-origin' } })

await app.register(cors, {
  origin: (process.env.CORS_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean),
  credentials: true,
})

await app.register(rateLimit, {
  max: Number(process.env.RATE_LIMIT_MAX) || 300,
  timeWindow: process.env.RATE_LIMIT_WINDOW || '1 minute',
})

await app.register(sensible)
await app.register(authPlugin)

app.get('/api/health', async () => ({ status: 'ok', time: new Date().toISOString() }))

await app.register(authRoutes, { prefix: '/api/auth' })
await app.register(movieRoutes, { prefix: '/api/movies' })
await app.register(categoryRoutes, { prefix: '/api/categories' })
await app.register(narratorRoutes, { prefix: '/api/narrators' })

app.setErrorHandler((error, request, reply) => {
  request.log.error(error)
  const status = error.statusCode || 500
  reply.code(status).send({
    error: error.name || 'InternalServerError',
    message: status === 500 ? 'Something went wrong.' : error.message,
  })
})

try {
  await connectDB(app.log)
  await seedDatabase(app.log)

  const port = Number(process.env.PORT) || 4000
  await app.listen({ port, host: '0.0.0.0' })

  closeWithGrace({ delay: 5000 }, async ({ err }) => {
    if (err) app.log.error(err)
    await app.close()
    await disconnectDB()
  })
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
