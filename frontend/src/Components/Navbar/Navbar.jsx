import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext'
import { Link } from 'react-router-dom'

export const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState('home')
    const [showCartPopup, setShowCartPopup] = useState(false)
    const [showSearchBox, setShowSearchBox] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const navbarRef = useRef(null)
  const { Food_List, cartItems, addtoCart, removeFromCart, currentUser, logout, searchQuery, setSearchQuery } = useContext(StoreContext)

    const cartList = useMemo(
      () => Food_List.filter((item) => (cartItems[item._id] || 0) > 0),
      [Food_List, cartItems]
    )

    const cartCount = useMemo(
      () => cartList.reduce((sum, item) => sum + (cartItems[item._id] || 0), 0),
      [cartList, cartItems]
    )

    const subtotal = useMemo(
      () => cartList.reduce((sum, item) => sum + item.price * (cartItems[item._id] || 0), 0),
      [cartList, cartItems]
    )

    const handleMenuSelect = (selectedMenu) => {
      setMenu(selectedMenu)
      setShowMobileMenu(false)
    }

    useEffect(() => {
      const handlePointerOutside = (event) => {
        if (!showMobileMenu || !navbarRef.current) {
          return
        }

        if (!navbarRef.current.contains(event.target)) {
          setShowMobileMenu(false)
        }
      }

      const handleEscapeKey = (event) => {
        if (event.key === 'Escape') {
          setShowMobileMenu(false)
        }
      }

      document.addEventListener('mousedown', handlePointerOutside)
      document.addEventListener('touchstart', handlePointerOutside)
      document.addEventListener('keydown', handleEscapeKey)

      return () => {
        document.removeEventListener('mousedown', handlePointerOutside)
        document.removeEventListener('touchstart', handlePointerOutside)
        document.removeEventListener('keydown', handleEscapeKey)
      }
    }, [showMobileMenu])


  return (
    <>
    {showCartPopup && <div className='cart-popup-overlay' onClick={() => setShowCartPopup(false)}></div>}
    <div className='navbar' ref={navbarRef}>
     {/* <img src={assets.food} className='logo-image' alt='search logo'/> */}
        <a href='/' className='logo'>
          <span className='logo-cutlery' aria-hidden='true'></span>
          <span className='logo-wordmark'>
            <span className='logo-afric'>Afric</span><span className='logo-food'>Food</span>
          </span>
        </a>

        <button
          type='button'
          className={`navbar-mobile-toggle ${showMobileMenu ? 'open' : ''}`}
          onClick={() => setShowMobileMenu((prev) => !prev)}
          aria-label='Toggle navigation menu'
          aria-controls='navbar-mobile-menu'
          aria-expanded={showMobileMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

         <ul id='navbar-mobile-menu' className={`navbar-menu ${showMobileMenu ? 'mobile-open' : ''}`}>
                <a href='/' onClick={() => handleMenuSelect('home')} className={menu === 'home' ? 'active' : ''}>Home</a>
            <a href='/#explore-menu' onClick={() => handleMenuSelect('menu')} className={menu === 'menu' ? 'active' : ''}>Menu</a>
          <a href='/#customer-reviews' onClick={() => handleMenuSelect('review')} className={menu === 'review' ? 'active' : ''}>Review</a>
            <a href='/#latest-blog' onClick={() => handleMenuSelect('blog')} className={menu === 'blog' ? 'active' : ''}>Blog</a>
              <a href='/#contact-us' onClick={() => handleMenuSelect('contact-us')} className={menu === 'contact-us' ? 'active' : ''}>Contact us</a>
            </ul>
            <div className='navbar-right'>
                <div className='navbar-search-wrap'>
                  <button
                    type='button'
                    className={`navbar-search-toggle ${showSearchBox ? 'active' : ''}`}
                    onClick={() => setShowSearchBox((prev) => !prev)}
                    aria-label='Search menu'
                    title='Search menu'
                  >
                    <img src={assets.investigation} className='search' alt='search logo'/>
                  </button>
                  {showSearchBox && (
                    <div className='navbar-search-box'>
                      <input
                        type='text'
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder='Search food, soup, rice...'
                        aria-label='Search menu items'
                      />
                      {searchQuery && (
                        <button
                          type='button'
                          className='navbar-search-clear'
                          onClick={() => setSearchQuery('')}
                          aria-label='Clear search'
                        >
                          ×
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div className='navbar-search-icon'>
                <img src={assets.shopping} alt='logo' onClick={() => setShowCartPopup((prev) => !prev)}/>
                {cartCount > 0 && <div className='dot'></div>}
                {showCartPopup && (
                  <div className='cart-popup' onClick={(e) => e.stopPropagation()}>
                    <h4>Your Cart</h4>
                    {cartList.length === 0 ? (
                      <p className='cart-popup-empty'>Your cart is empty.</p>
                    ) : (
                      <>
                        <div className='cart-popup-items'>
                          {cartList.map((item) => (
                            <div className='cart-popup-item' key={item._id}>
                              <span className='cart-popup-item-name'>{item.name}</span>
                              <div className='cart-popup-item-controls'>
                                <button
                                  type='button'
                                  className='cart-qty-btn'
                                  onClick={() => removeFromCart(item._id)}
                                  aria-label={`Decrease ${item.name} quantity`}
                                >
                                  -
                                </button>
                                <span className='cart-popup-item-qty'>{cartItems[item._id]}</span>
                                <button
                                  type='button'
                                  className='cart-qty-btn'
                                  onClick={() => addtoCart(item._id)}
                                  aria-label={`Increase ${item.name} quantity`}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className='cart-popup-total'>
                          <span>Subtotal</span>
                          <span>${subtotal}</span>
                        </div>
                      </>
                    )}
                    <Link to='/cart' className='cart-popup-btn' onClick={() => setShowCartPopup(false)}>Open Cart</Link>
                  </div>
                )}
                </div>
                {currentUser ? (
                  <div className='navbar-account'>
                    <span className='navbar-account-name'>Hi, {currentUser.name.split(' ')[0]}</span>
                    <button onClick={logout} type='button'>Logout</button>
                  </div>
                ) : (
                  <button onClick={() => setShowLogin(true)}>Sign in</button>
                )}
            </div>
    </div>
    </>
  )
}


export default Navbar