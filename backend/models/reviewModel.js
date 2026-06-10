import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: String, default: '' },
    name: { type: String, required: true, trim: true },
    foodId: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '', trim: true },
  },
  { timestamps: true },
)

const reviewModel = mongoose.models.review || mongoose.model('review', reviewSchema)

export default reviewModel
