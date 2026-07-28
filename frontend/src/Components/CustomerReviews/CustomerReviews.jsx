import React, { useContext, useMemo, useState } from 'react'
import './CustomerReviews.css'
import { StoreContext } from '../../Context/StoreContext'

const CustomerReviews = () => {
  const { Food_List, reviews, addReview } = useContext(StoreContext)
  const [selectedFoodId, setSelectedFoodId] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [statusType, setStatusType] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const recentReviews = useMemo(() => reviews.slice(0, 6), [reviews])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!selectedFoodId) {
      setStatusType('error')
      setStatusMessage('Please select a menu item before submitting your review.')
      return
    }

    setIsSubmitting(true)
    setStatusType('')
    setStatusMessage('')

    try {
      await addReview({
        name: customerName,
        foodId: selectedFoodId,
        rating,
        comment,
      })

      setCustomerName('')
      setRating(5)
      setComment('')
      setStatusType('success')
      setStatusMessage('Thanks for your feedback. Your review is now visible to everyone.')
    } catch (error) {
      setStatusType('error')
      setStatusMessage(error.message || 'Unable to submit your review at the moment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className='customer-reviews' id='customer-reviews'>
      <h2>Customer Reviews</h2>
      <p className='customer-reviews-subtext'>
        Share your feedback on any dish. Menu card stars update with real customer ratings.
      </p>

      <form className='review-form' onSubmit={handleSubmit}>
        <input
          type='text'
          value={customerName}
          onChange={(event) => setCustomerName(event.target.value)}
          placeholder='Your name'
          maxLength={60}
        />

        <select
          value={selectedFoodId}
          onChange={(event) => setSelectedFoodId(event.target.value)}
          required
        >
          <option value=''>Select menu item</option>
          {Food_List.map((item, index) => (
            <option key={`${item._id || 'food'}-${index}`} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>

        <select value={rating} onChange={(event) => setRating(Number(event.target.value))}>
          <option value={5}>5 Stars</option>
          <option value={4}>4 Stars</option>
          <option value={3}>3 Stars</option>
          <option value={2}>2 Stars</option>
          <option value={1}>1 Star</option>
        </select>

        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder='Write your review'
          rows={3}
          maxLength={300}
        />

        <button type='submit' disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit Review'}</button>
      </form>

      {statusMessage && (
        <p className={statusType === 'error' ? 'review-status review-status-error' : 'review-status review-status-success'}>
          {statusMessage}
        </p>
      )}

      <div className='review-list'>
        {recentReviews.length === 0 ? (
          <p className='review-empty'>No reviews yet. Be the first to review a dish.</p>
        ) : (
          recentReviews.map((review) => {
            const food = Food_List.find((item) => item._id === review.foodId)

            return (
              <article className='review-card' key={review._id || review.id}>
                <div className='review-card-head'>
                  <strong>{review.name}</strong>
                  <span>{food?.name || 'Menu Item'}</span>
                </div>
                <p className='review-stars'>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
                <p>{review.comment || 'Great dish and service.'}</p>
              </article>
            )
          })
        )}
      </div>
    </section>
  )
}

export default CustomerReviews
