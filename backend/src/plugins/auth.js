import fp from 'fastify-plugin'
import fastifyJwt from '@fastify/jwt'

export default fp(async function authPlugin(app) {
  app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET,
    sign: { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
  })

  // Use as a route's preHandler: requires a valid Bearer token.
  app.decorate('requireAuth', async function requireAuth(request, reply) {
    try {
      await request.jwtVerify()
    } catch {
      reply.code(401).send({ error: 'Unauthorized', message: 'Missing or invalid token.' })
    }
  })
})
