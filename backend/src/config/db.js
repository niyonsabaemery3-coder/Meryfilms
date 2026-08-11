import mongoose from 'mongoose'

mongoose.set('strictQuery', true)

/**
 * Connects to MongoDB (Atlas free tier or any Mongo instance).
 * Pool size is kept modest on purpose — Atlas M0 (free) caps total
 * connections, and Mongoose reuses this single pool across all requests,
 * so this scales fine for a small/medium app without extra configuration.
 */
export async function connectDB(logger) {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI is not set. Copy .env.example to .env and fill it in.')
  }

  mongoose.connection.on('connected', () => logger.info('MongoDB connected'))
  mongoose.connection.on('error', (err) => logger.error({ err }, 'MongoDB connection error'))
  mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'))

  await mongoose.connect(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
    autoIndex: process.env.NODE_ENV !== 'production', // build indexes automatically in dev only
  })

  return mongoose.connection
}

export async function disconnectDB() {
  await mongoose.disconnect()
}
