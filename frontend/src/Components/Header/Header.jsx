import React from 'react'
import './Header.css'

const Header = ({ onViewMenuClick }) => {
  return (
    <div className='header'>
        <div className='header-contents'>
    <h1 >African food at its best! </h1>
            <p>Order your  sumptuous African dishes,
        made with the freshest ingredients and traditional recipes. </p>
        <button onClick={onViewMenuClick}>View Menu </button>

        </div>


    </div>
  )
}

export default Header