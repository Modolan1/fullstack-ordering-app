import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../Context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({category}) => {

    const {Food_List, searchQuery} = useContext(StoreContext)

    const normalizedSearchQuery = searchQuery.trim().toLowerCase()

    const filteredFoodList = Food_List.filter((item) => {
        const matchesCategory = category === 'All' || category === item.category

        if (!normalizedSearchQuery) {
            return matchesCategory
        }

        const searchableText = [item.name, item.description, item.category]
            .join(' ')
            .toLowerCase()

        return matchesCategory && searchableText.includes(normalizedSearchQuery)
    })
  return (
    <div className='food_display' id='food_display'>
        <h2>Top Dishes near you</h2>
                {filteredFoodList.length === 0 ? (
                    <p className='food-display-empty'>No menu items matched your search.</p>
                ) : (
                    <div className='food-display-list'>
                            {filteredFoodList.map((item,index)=>(
                                    <FoodItem key={index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image}/>
                            ))}
                    </div>
                )}
        
    </div>
  )
}

export default FoodDisplay