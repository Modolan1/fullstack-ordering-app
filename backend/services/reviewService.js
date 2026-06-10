import { findFoodById } from '../repositories/foodRepository.js'
import { createReview, findAllReviews } from '../repositories/reviewRepository.js'
import { AppError } from '../utils/appError.js'

const listReviews = async () => findAllReviews()

const addReview = async ({ userId = '', name, foodId, rating, comment }) => {
  const targetFood = await findFoodById(foodId)

  if (!targetFood) {
    throw new AppError('Menu item was not found for this review.', 404)
  }

  return createReview({
    userId,
    name,
    foodId,
    rating,
    comment,
  })
}

export { addReview, listReviews }
