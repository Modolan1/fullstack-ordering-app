import React, { useContext, useEffect, useRef, useState } from 'react'
import './FoodItem.css'
import { StoreContext } from '../../Context/StoreContext'

const FoodItem = ( {id,name,price,description,category,image}) => {
  
  const {cartItems, addtoCart, removeFromCart, getFoodRating} = useContext(StoreContext);
  const [isCounterOpen, setIsCounterOpen] = useState(false)
  const counterRef = useRef(null)
  const quantity = cartItems[id] || 0
  const rating = getFoodRating(id)
  const activeStars = Math.round(rating)

  useEffect(() => {
    if (!isCounterOpen) {
      return undefined
    }

    const handleOutsideClick = (event) => {
      if (counterRef.current && !counterRef.current.contains(event.target)) {
        setIsCounterOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [isCounterOpen])

  useEffect(() => {
    if (quantity === 0) {
      setIsCounterOpen(false)
    }
  }, [quantity])

  const handleAddToCartClick = () => {
    if (quantity === 0) {
      addtoCart(id)
    }

    setIsCounterOpen(true)
  }

  const handleOpenCounter = () => {
    if (quantity > 0) {
      setIsCounterOpen(true)
    }
  }

  return (
    <div className='food-item'>
      <div className='food-item-img-container'>
        <img className='food-item-image' src={image }alt=""/>
      </div>
      <div className='food-item-info'>
        <div className='food-item-name-rating'>
        <p>{name}</p>
        <div className='food-item-rating'>
          <div className='food-item-rating-stars'>
            {[1, 2, 3, 4, 5].map((value) => (
              <span
                key={value}
                className={value <= activeStars ? 'food-item-rating-star active' : 'food-item-rating-star'}
              >
                ★
              </span>
            ))}
          </div>
          <span className='food-item-rating-value'>{rating.toFixed(1)}</span>
        </div>
        </div>
       <p className="food-item-description">{description}</p>
       <div className='food-item-price-row'>
         <p className="food-item-price">${price}</p>
         {quantity === 0 || !isCounterOpen ? (
           <button
             className='food-item-add-btn'
             onClick={quantity === 0 ? handleAddToCartClick : handleOpenCounter}
             type='button'
           >
             {quantity > 0 ? `In Cart (${quantity})` : 'Add to Cart'}
           </button>
         ) : (
           <div className='food-item-counter' ref={counterRef}>
             <button onClick={() => removeFromCart(id)} type='button'>-</button>
             <p>{quantity}</p>
             <button onClick={() => addtoCart(id)} type='button'>+</button>
           </div>
         )}
       </div>
      </div>
    </div>
  )
}

export default FoodItem