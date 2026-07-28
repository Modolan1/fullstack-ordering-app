import React, { useContext, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'
import './MobileQuickAccess.css'

const MobileQuickAccess = () => {
  const location = useLocation()
  const { cartItems } = useContext(StoreContext)

  const cartCount = useMemo(
    () => Object.values(cartItems).reduce((sum, qty) => sum + Number(qty || 0), 0),
    [cartItems]
  )

  const isHomeActive = location.pathname === '/'
  const isCartActive = location.pathname === '/cart' || location.pathname === '/place-order'

  return (
    <nav className='mobile-quick-access' aria-label='Quick access'>
      <Link to='/' className={`mobile-quick-item ${isHomeActive ? 'active' : ''}`}>
        <span className='mobile-quick-icon' aria-hidden='true'>
          <svg viewBox='0 0 24 24' focusable='false'>
            <path d='M3 11.5L12 4l9 7.5v8.5a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z' />
          </svg>
        </span>
        <span className='mobile-quick-label'>Home</span>
      </Link>

      <a href='/#explore-menu' className='mobile-quick-item'>
        <span className='mobile-quick-icon' aria-hidden='true'>
          <svg viewBox='0 0 24 24' focusable='false'>
            <path d='M4 6h16v2H4zm0 5h16v2H4zm0 5h10v2H4z' />
          </svg>
        </span>
        <span className='mobile-quick-label'>Menu</span>
      </a>

      <Link to='/cart' className={`mobile-quick-item ${isCartActive ? 'active' : ''}`}>
        <span className='mobile-quick-icon has-badge' aria-hidden='true'>
          <svg viewBox='0 0 24 24' focusable='false'>
            <path d='M7 5h-2l-1 2v1h2l2.2 7.5A2.2 2.2 0 0 0 10.3 17h7.4a2.2 2.2 0 0 0 2.1-1.6L21 9H8.1L7.5 7H21V5H7zM10.5 20a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm6 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z' />
          </svg>
          {cartCount > 0 && <span className='mobile-quick-badge'>{cartCount}</span>}
        </span>
        <span className='mobile-quick-label'>Cart</span>
      </Link>

      <a href='/#contact-us' className='mobile-quick-item'>
        <span className='mobile-quick-icon' aria-hidden='true'>
          <svg viewBox='0 0 24 24' focusable='false'>
            <path d='M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1l-9 6-9-6zm0 4.2V18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7.8l-8.4 5.6a1 1 0 0 1-1.2 0z' />
          </svg>
        </span>
        <span className='mobile-quick-label'>Contact</span>
      </a>
    </nav>
  )
}

export default MobileQuickAccess
