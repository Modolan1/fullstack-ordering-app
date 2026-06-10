import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import validator from 'validator'
import { createUser, findUserByEmail, findUserById } from '../repositories/userRepository.js'
import { AppError } from '../utils/appError.js'

const getJwtSecret = () => process.env.JWT_SECRET || 'development-secret-change-me'

const createToken = (userId) => jwt.sign({ id: userId }, getJwtSecret(), { expiresIn: '7d' })

const sanitizeAuthPayload = (body) => ({
  name: String(body.name || '').trim(),
  email: String(body.email || '').trim().toLowerCase(),
  password: String(body.password || ''),
})

const validateAuthPayload = ({ name, email, password }, requireName) => {
  if (requireName && (!name || name.length < 2 || name.length > 80)) {
    return 'Name must be between 2 and 80 characters.'
  }

  if (!validator.isEmail(email)) {
    return 'Email is invalid.'
  }

  if (password.length < 8 || password.length > 128) {
    return 'Password must be between 8 and 128 characters.'
  }

  return ''
}

const registerUser = async (body) => {
  const payload = sanitizeAuthPayload(body)
  const validationError = validateAuthPayload(payload, true)

  if (validationError) {
    throw new AppError(validationError, 400)
  }

  const existingUser = await findUserByEmail(payload.email)

  if (existingUser) {
    throw new AppError('An account already exists for this email.', 409)
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10)
  const user = await createUser({
    name: payload.name,
    email: payload.email,
    password: hashedPassword,
  })

  return {
    token: createToken(user._id.toString()),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  }
}

const loginUser = async (body) => {
  const payload = sanitizeAuthPayload(body)
  const validationError = validateAuthPayload(payload, false)

  if (validationError) {
    throw new AppError(validationError, 400)
  }

  const user = await findUserByEmail(payload.email)

  if (!user) {
    throw new AppError('Invalid email or password.', 401)
  }

  const passwordMatches = await bcrypt.compare(payload.password, user.password)

  if (!passwordMatches) {
    throw new AppError('Invalid email or password.', 401)
  }

  return {
    token: createToken(user._id.toString()),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  }
}

const createGuestSession = async () => {
  const guestId = `guest_${Date.now()}`

  return {
    token: jwt.sign(
      {
        id: guestId,
        isGuest: true,
        name: 'Guest',
      },
      getJwtSecret(),
      { expiresIn: '24h' },
    ),
    user: {
      id: guestId,
      name: 'Guest',
      email: '',
      isGuest: true,
    },
  }
}

const getCurrentUser = async (userId) => {
  const user = await findUserById(userId)

  if (!user) {
    throw new AppError('User not found.', 404)
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
  }
}

export { createGuestSession, getCurrentUser, loginUser, registerUser }
