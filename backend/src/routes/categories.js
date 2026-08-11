import { Category } from '../models/Category.js'

export default async function categoryRoutes(app) {
  // GET /api/categories — public
  app.get('/', async () => {
    const categories = await Category.find().sort({ order: 1, label: 1 })
    return categories
  })

  // POST /api/categories — admin only, create one
  app.post('/', { preHandler: app.requireAuth }, async (request, reply) => {
    const { slug, label, order } = request.body || {}
    if (!slug || !label) {
      return reply.code(400).send({ error: 'ValidationError', message: 'slug and label are required.' })
    }
    const exists = await Category.findOne({ slug })
    if (exists) return reply.code(409).send({ error: 'Conflict', message: 'Category already exists.' })
    const category = await Category.create({ slug, label, order: order ?? 0 })
    return reply.code(201).send(category)
  })

  // PUT /api/categories/:slug — admin only, update
  app.put('/:slug', { preHandler: app.requireAuth }, async (request, reply) => {
    const category = await Category.findOneAndUpdate(
      { slug: request.params.slug },
      { $set: request.body },
      { new: true }
    )
    if (!category) return reply.code(404).send({ error: 'NotFound' })
    return category
  })

  // DELETE /api/categories/:slug — admin only
  app.delete('/:slug', { preHandler: app.requireAuth }, async (request, reply) => {
    const result = await Category.deleteOne({ slug: request.params.slug })
    if (result.deletedCount === 0) return reply.code(404).send({ error: 'NotFound' })
    return reply.code(204).send()
  })

  // PUT /api/categories/bulk-sync — admin only. Replaces the whole set in one
  // atomic bulkWrite (upsert changed, delete removed) — same shape as the
  // frontend's old saveCategories(wholeArray), but a single efficient DB call
  // instead of N requests, so it stays fast even as the catalog grows.
  app.put('/bulk-sync', { preHandler: app.requireAuth }, async (request, reply) => {
    const incoming = Array.isArray(request.body) ? request.body : []
    const slugs = incoming.map((c) => c.id || c.slug).filter(Boolean)

    const ops = incoming.map((c, i) => ({
      updateOne: {
        filter: { slug: c.id || c.slug },
        update: { $set: { slug: c.id || c.slug, label: c.label, order: i } },
        upsert: true,
      },
    }))
    if (ops.length) await Category.bulkWrite(ops)
    await Category.deleteMany({ slug: { $nin: slugs } })

    const categories = await Category.find().sort({ order: 1 })
    return categories
  })
}
