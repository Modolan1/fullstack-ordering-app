import React, { useContext, useState } from 'react'
import './Cart.css'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom'
import { sanitizePromoCode, validatePromoCode } from '../../utils/inputSecurity'

export const Cart = ({ setShowLogin }) => {
  const navigate = useNavigate()
  const { Food_List, cartItems, addtoCart, removeFromCart, token, currentUser } = useContext(StoreContext)
  const [promoCode, setPromoCode] = useState('')
  const [promoStatus, setPromoStatus] = useState({ type: '', message: '' })

  const subtotal = Food_List.reduce((total, item) => {
    const quantity = cartItems[item._id] || 0
    return total + quantity * item.price
  }, 0)

  const deliveryFee = subtotal === 0 ? 0 : 2
  const total = subtotal + deliveryFee

  const handlePromoChange = (event) => {
    const nextValue = sanitizePromoCode(event.target.value)
    setPromoCode(nextValue)

    if (!nextValue) {
      setPromoStatus({ type: '', message: '' })
      return
    }

    const error = validatePromoCode(nextValue)
    setPromoStatus(error ? { type: 'error', message: error } : { type: '', message: '' })
  }

  const handlePromoSubmit = () => {
    const error = validatePromoCode(promoCode)

    if (error) {
      setPromoStatus({ type: 'error', message: error })
      return
    }

    setPromoStatus({ type: 'info', message: 'Promo code validation passed, but promo support is not connected yet.' })
  }

  const handleCheckoutClick = () => {
    if (!token || !currentUser) {
      sessionStorage.setItem('postLoginRedirect', '/place-order')
      setShowLogin(true)
      return
    }

    navigate('/place-order')
  }

  return (
    <div className='cart'>
      <div className='cart-items'>
        <div className='cart-items-title'>
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <hr />

        {Food_List.map((item) => {
          const quantity = cartItems[item._id] || 0

          if (quantity > 0) {
            return (
              <div key={item._id}>
                <div className='cart-items-title cart-items-item'>
                  <img src={item.image} alt={item.name} />
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <div className='cart-quantity-controls'>
                    <button
                      type='button'
                      className='cart-qty-btn'
                      onClick={() => removeFromCart(item._id)}
                      aria-label={`Decrease ${item.name} quantity`}
                    >
                      -
                    </button>
                    <span>{quantity}</span>
                    <button
                      type='button'
                      className='cart-qty-btn'
                      onClick={() => addtoCart(item._id)}
                      aria-label={`Increase ${item.name} quantity`}
                    >
                      +
                    </button>
                  </div>
                  <p>${item.price * quantity}</p>
                  <p onClick={() => removeFromCart(item._id)} className='cross'>x</p>
                </div>
                <hr />
              </div>
            )
          }

          return null
        })}
      </div>

      <div className='cart-bottom'>
        <div className='cart-total'>
          <h2>Cart Totals</h2>
          <div>
            <div className='cart-total-details'>
              <p>Subtotal</p>
              <p>${subtotal}</p>
            </div>
            <hr />
            <div className='cart-total-details'>
              <p>Delivery Fee</p>
              <p>${deliveryFee}</p>
            </div>
            <hr />
            <div className='cart-total-details'>
              <b>Total</b>
              <b>${total}</b>
            </div>
          </div>
          <button type='button' disabled={subtotal === 0} onClick={handleCheckoutClick}>PROCEED TO CHECKOUT</button>
        </div>

        <div className='cart-promocode'>
          <div>
            <p>If you have a promo code, enter it here</p>
            <div className='cart-promocode-input'>
              <input type='text' placeholder='Promo code' value={promoCode} onChange={handlePromoChange} maxLength='20' aria-invalid={promoStatus.type === 'error'} />
              <button type='button' onClick={handlePromoSubmit}>Submit</button>
            </div>
            {promoStatus.message && <p className={`cart-promocode-status ${promoStatus.type}`}>{promoStatus.message}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart