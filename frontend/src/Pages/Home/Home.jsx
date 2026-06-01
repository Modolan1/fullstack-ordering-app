import React, { useState } from 'react'
import './Home.css'
import Header from '../../Components/Header/Header'
import EXploreMenu from '../../Components/ExploreMenu/EXploreMenu'
import FoodDisplay from '../../Components/FoodDisplay/FoodDisplay'
import AppDownload from '../../Components/AppDownload'

export const Home = () => {
  
  const [ category, setCategory] = useState("All");

  const handleViewMenuClick = () => {
    const menuSection = document.getElementById('explore-menu')
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }


  return (
    <div>
        <Header onViewMenuClick={handleViewMenuClick}/>
        <EXploreMenu category={category} setCategory={setCategory}/>
        <FoodDisplay category={category}/>
        <AppDownload/>
    </div>
  )
}

export default Home