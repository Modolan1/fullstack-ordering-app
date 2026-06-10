import {
  addReview as addReviewService,
  listReviews as listReviewsService,
} from '../services/reviewService.js'
import { asyncHandler } from '../utils/appError.js'

const listReviews = asyncHandler(async (req, res) => {
  const reviews = await listReviewsService()
  return res.json({ success: true, data: reviews })
})

const addReview = asyncHandler(async (req, res) => {
  const review = await addReviewService({
    userId: req.userId || '',
    name: req.body.name,
    foodId: req.body.foodId,
    rating: req.body.rating,
    comment: req.body.comment,
  })

  return res.status(201).json({
    success: true,
    message: 'Review submitted successfully.',
    data: review,
  })
})

export { addReview, listReviews }
