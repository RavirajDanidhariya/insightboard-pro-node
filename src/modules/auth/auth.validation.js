const { z } = require('zod')

const registerShema = z.object({
  email: z.string().trim().email('Invalid email format').toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at leat 8 characters')
    .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
    .regex(/[a-z]/, 'Password must include at least one lowercase letter')
    .regex(/[0-9]/, 'Password must include at least one number')
    .regex(
      /[^A-Za-z0-9]/,
      'Password must include at least one special character'
    ),
  displayName: z
    .string()
    .trim()
    .min(2, 'Display name must be at leat 2 characters')
    .max(80, 'Display name must be at leat 80 characters')
})

const loginSchema = z.object({
  email: z.string().trim().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
})

module.exports = { registerShema, loginSchema }
