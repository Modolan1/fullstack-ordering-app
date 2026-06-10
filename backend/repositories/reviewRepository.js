import reviewModel from '../models/reviewModel.js'

const createReview = (payload) => reviewModel.create(payload)

const findAllReviews = () => reviewModel.find({}).sort({ createdAt: -1 })

export { createReview, findAllReviews }
