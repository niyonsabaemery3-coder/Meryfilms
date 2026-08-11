import { Movie } from '../models/Movie.js'

export default async function movieRoutes(app) {
  // GET /api/movies — public. Supports ?category=&search=&trending=&featured=&page=&limit=
  app.get('/', async (request) => {
    const { category, search, trending, featured, page = 1, limit = 60 } = request.query
    const filter = {}
    if (category) filter.category = category
    if (trending === 'true') filter.trending = true
    if (featured === 'true') filter.featured = true
    if (search) filter.$text = { $search: search }

    const skip = (Number(page) - 1) * Number(limit)
    const [items, total] = await Promise.all([
      Movie.find(filter).sort({ uploadedAt: -1 }).skip(skip).limit(Number(limit)),
      Movie.countDocuments(filter),
    ])
    return { items, total, page: Number(page), limit: Number(limit) }
  })

  // GET /api/movies/:id — public
  app.get('/:id', async (request, reply) => {
    const movie = await Movie.findById(request.params.id)
    if (!movie) return reply.code(404).send({ error: 'NotFound' })
    return movie
  })

  // POST /api/movies — admin only
  app.post('/', { preHandler: app.requireAuth }, async (request, reply) => {
    const movie = await Movie.create(request.body)
    return reply.code(201).send(movie)
  })

  // PUT /api/movies/:id — admin only
  app.put('/:id', { preHandler: app.requireAuth }, async (request, reply) => {
    const movie = await Movie.findByIdAndUpdate(request.params.id, { $set: request.body }, { new: true })
    if (!movie) return reply.code(404).send({ error: 'NotFound' })
    return movie
  })

  // DELETE /api/movies/:id — admin only
  app.delete('/:id', { preHandler: app.requireAuth }, async (request, reply) => {
    const result = await Movie.deleteOne({ _id: request.params.id })
    if (result.deletedCount === 0) return reply.code(404).send({ error: 'NotFound' })
    return reply.code(204).send()
  })

  // POST /api/movies/:id/view — public, fire-and-forget view counter
  app.post('/:id/view', async (request, reply) => {
    const movie = await Movie.findByIdAndUpdate(
      request.params.id,
      { $inc: { views: 1 } },
      { new: true, select: 'views' }
    )
    if (!movie) return reply.code(404).send({ error: 'NotFound' })
    return { views: movie.views }
  })

  // POST /api/movies/:id/like — public
  app.post('/:id/like', async (request, reply) => {
    const movie = await Movie.findByIdAndUpdate(
      request.params.id,
      { $inc: { likes: 1 } },
      { new: true, select: 'likes' }
    )
    if (!movie) return reply.code(404).send({ error: 'NotFound' })
    return { likes: movie.likes }
  })

  // POST /api/movies/:id/comments — public (viewers comment without admin login)
  app.post('/:id/comments', async (request, reply) => {
    const { author, text } = request.body || {}
    if (!author || !text) {
      return reply.code(400).send({ error: 'ValidationError', message: 'author and text are required.' })
    }
    const movie = await Movie.findByIdAndUpdate(
      request.params.id,
      { $push: { comments: { author, text, createdAt: Date.now(), replies: [] } } },
      { new: true }
    )
    if (!movie) return reply.code(404).send({ error: 'NotFound' })
    return movie.comments[movie.comments.length - 1]
  })

  // PUT /api/movies/bulk-sync — admin only. Same efficient upsert+prune
  // pattern as categories/narrators, for the admin panel's "save all" action.
  app.put('/bulk-sync', { preHandler: app.requireAuth }, async (request, reply) => {
    const incoming = Array.isArray(request.body) ? request.body : []
    const withId = incoming.filter((m) => m.id)
    const withoutId = incoming.filter((m) => !m.id)
    const keepIds = withId.map((m) => m.id)

    const ops = withId.map((m) => {
      const { id, ...rest } = m
      return { updateOne: { filter: { _id: id }, update: { $set: rest } } }
    })
    if (ops.length) await Movie.bulkWrite(ops)
    if (withoutId.length) await Movie.insertMany(withoutId)
    if (keepIds.length) await Movie.deleteMany({ _id: { $nin: keepIds } })

    return Movie.find().sort({ uploadedAt: -1 })
  })
}
