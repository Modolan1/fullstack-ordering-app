import React, { useContext, useEffect, useRef, useState } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext'

const FoodItem = ( {id,name,price,description,category,image}) => {
  
  const {cartItems, addtoCart, removeFromCart} = useContext(StoreContext);
  const [isCounterOpen, setIsCounterOpen] = useState(false)
  const counterRef = useRef(null)
  const quantity = cartItems[id] || 0

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

  const handleAddIconClick = () => {
    if (quantity === 0) {
      addtoCart(id)
    }

    setIsCounterOpen(true)
  }

  return (
    <div className='food-item'>
      <div className='food-item-img-container'>
        <img className='food-item-image' src={image }alt=""/>
        
        { quantity === 0 || !isCounterOpen
        ?<button className={`add ${quantity > 0 ? 'has-qty' : ''}`} onClick={handleAddIconClick} type='button' ref={counterRef}>
          +
          {quantity > 0 && <span className='add-count-badge'>{quantity}</span>}
        </button>:
        <div className='food-item-counter' ref={counterRef}>
          <button onClick={()=>removeFromCart(id)} type='button'>-</button>
          <p>{quantity}</p>
          <button onClick={()=>addtoCart(id)} type='button'>+</button>
          </div>
        
          }
      </div>
      <div className='food-item-info'>
        <div className='food-item-name-rating'>
        <p>{name}</p>
        <img src={assets.rating_starts} className="image"></img>
        </div>
       <p className="food-item-description">{description}</p>
       <p className="food-item-price">${price}</p>
      </div>
    </div>
  )
}

export default FoodItem