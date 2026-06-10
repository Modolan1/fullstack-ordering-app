import express from 'express'
import { addReview, listReviews } from '../controllers/reviewController.js'
import { validateAddReview } from '../middleware/validation.js'

const reviewRouter = express.Router()

reviewRouter.get('/list', listReviews)
reviewRouter.post('/add', validateAddReview, addReview)

export default reviewRouter
