import { Narrator } from '../models/Narrator.js'

export default async function narratorRoutes(app) {
  app.get('/', async () => Narrator.find().sort({ name: 1 }))

  app.post('/', { preHandler: app.requireAuth }, async (request, reply) => {
    const { slug, name } = request.body || {}
    if (!slug || !name) {
      return reply.code(400).send({ error: 'ValidationError', message: 'slug and name are required.' })
    }
    const exists = await Narrator.findOne({ slug })
    if (exists) return reply.code(409).send({ error: 'Conflict', message: 'Narrator already exists.' })
    const narrator = await Narrator.create({ slug, name })
    return reply.code(201).send(narrator)
  })

  app.put('/:slug', { preHandler: app.requireAuth }, async (request, reply) => {
    const narrator = await Narrator.findOneAndUpdate(
      { slug: request.params.slug },
      { $set: request.body },
      { new: true }
    )
    if (!narrator) return reply.code(404).send({ error: 'NotFound' })
    return narrator
  })

  app.delete('/:slug', { preHandler: app.requireAuth }, async (request, reply) => {
    const result = await Narrator.deleteOne({ slug: request.params.slug })
    if (result.deletedCount === 0) return reply.code(404).send({ error: 'NotFound' })
    return reply.code(204).send()
  })

  // PUT /api/narrators/bulk-sync — admin only, same pattern as categories.
  app.put('/bulk-sync', { preHandler: app.requireAuth }, async (request, reply) => {
    const incoming = Array.isArray(request.body) ? request.body : []
    const slugs = incoming.map((n) => n.id || n.slug).filter(Boolean)

    const ops = incoming.map((n) => ({
      updateOne: {
        filter: { slug: n.id || n.slug },
        update: { $set: { slug: n.id || n.slug, name: n.name } },
        upsert: true,
      },
    }))
    if (ops.length) await Narrator.bulkWrite(ops)
    await Narrator.deleteMany({ slug: { $nin: slugs } })

    return Narrator.find().sort({ name: 1 })
  })
}
