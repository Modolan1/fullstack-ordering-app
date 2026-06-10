import {
  createGuestSession as createGuestSessionService,
  getCurrentUser as getCurrentUserService,
  loginUser as loginUserService,
  registerUser as registerUserService,
} from '../services/userService.js'
import { asyncHandler } from '../utils/appError.js'

const registerUser = asyncHandler(async (req, res) => {
  const result = await registerUserService(req.body)

  return res.status(201).json({
    success: true,
    message: 'Account created successfully.',
    token: result.token,
    user: result.user,
  })
})

const loginUser = asyncHandler(async (req, res) => {
  const result = await loginUserService(req.body)

  return res.json({
    success: true,
    message: 'Login successful.',
    token: result.token,
    user: result.user,
  })
})

const guestLogin = asyncHandler(async (req, res) => {
  const result = await createGuestSessionService()

  return res.json({
    success: true,
    message: 'Guest session started.',
    token: result.token,
    user: result.user,
  })
})

const getCurrentUser = asyncHandler(async (req, res) => {
  if (req.authUser?.isGuest) {
    return res.json({
      success: true,
      user: {
        id: req.authUser.id,
        name: req.authUser.name || 'Guest',
        email: '',
        isGuest: true,
      },
    })
  }

  const user = await getCurrentUserService(req.userId)

  return res.json({
    success: true,
    user,
  })
})

export { getCurrentUser, guestLogin, loginUser, registerUser }