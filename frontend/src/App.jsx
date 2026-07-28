import React, { useState } from 'react'
import Navbar from './Components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home/Home'
import Cart from './Pages/Cart/Cart'
import PlaceOrder from './Pages/PlaceOrder/PlaceOrder'
import BlogDetail from './Pages/BlogDetail/BlogDetail'
import ContactSection from './Components/ContactSection/ContactSection'
import Footer from './Components/Footer/Footer'
import LoginPopup from './Components/LoginPopup/LoginPopup'
import PWAInstallPrompt from './Components/PWAInstallPrompt/PWAInstallPrompt'
import MobileQuickAccess from './Components/MobileQuickAccess/MobileQuickAccess'

export const App = () => {
  const [showLogin, setShowLogin] = useState(false)

  return (
    <>
    {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
    <div className='app'>
      <Navbar setShowLogin={setShowLogin}/>
      <PWAInstallPrompt/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/blog/:slug' element={<BlogDetail/>}/>
        <Route path='/cart' element={<Cart setShowLogin={setShowLogin}/>}/>
        <Route path='/place-order' element={<PlaceOrder setShowLogin={setShowLogin}/>}/>
      </Routes>
      <MobileQuickAccess/>
      <ContactSection/>
    </div>
    <Footer/>
    </>
  )
}

export default App