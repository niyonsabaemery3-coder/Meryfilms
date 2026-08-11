import { User } from '../models/User.js'

const loginSchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 1 },
    },
  },
}

export default async function authRoutes(app) {
  // POST /api/auth/login — real credential check against the hashed password.
  app.post('/login', { schema: loginSchema }, async (request, reply) => {
    const { email, password } = request.body

    // select('+passwordHash') because the schema hides it by default.
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash')

    // Same error for "no such user" and "wrong password" — don't leak which one.
    if (!user || !(await user.comparePassword(password))) {
      return reply.code(401).send({ error: 'InvalidCredentials', message: 'Email cyangwa ijambo ry\'ibanga sibyo.' })
    }

    user.lastLoginAt = new Date()
    await user.save()

    const token = app.jwt.sign({ sub: user._id.toString(), email: user.email, role: user.role })
    return { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } }
  })

  // GET /api/auth/me — used by the frontend on load to check for a valid stored token.
  app.get('/me', { preHandler: app.requireAuth }, async (request, reply) => {
    const user = await User.findById(request.user.sub)
    if (!user) return reply.code(404).send({ error: 'NotFound' })
    return { user }
  })
}
