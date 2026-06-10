import { createContext, useEffect, useState } from "react";
import { Food_List } from "../assets/assets";
import { API_URL, apiFetch } from "../utils/api";

export const StoreContext = createContext(null)
const authStorageKey = "foodDeliveryToken"
const cartStorageKey = "foodDeliveryCartItems"

const readStoredCartItems = () => {
    try {
        const rawCartItems = localStorage.getItem(cartStorageKey)

        if (!rawCartItems) {
            return {}
        }

        const parsedCartItems = JSON.parse(rawCartItems)

        if (!parsedCartItems || typeof parsedCartItems !== 'object' || Array.isArray(parsedCartItems)) {
            return {}
        }

        const normalizedCartItems = {}

        Object.entries(parsedCartItems).forEach(([itemId, quantity]) => {
            const safeItemId = String(itemId || '').trim()
            const safeQuantity = Number(quantity)

            if (safeItemId && Number.isInteger(safeQuantity) && safeQuantity > 0) {
                normalizedCartItems[safeItemId] = safeQuantity
            }
        })

        return normalizedCartItems
    } catch {
        return {}
    }
}

const buildRatingsIndex = (reviewList = []) => (
    reviewList.reduce((accumulator, review) => {
        const foodId = String(review?.foodId || '').trim()
        const rating = Number(review?.rating) || 0

        if (!foodId || !rating) {
            return accumulator
        }

        if (!accumulator[foodId]) {
            accumulator[foodId] = []
        }

        accumulator[foodId].push(rating)
        return accumulator
    }, {})
)

const StoreContextProvider = (props) =>{

    const [foodList, setFoodList] = useState(Food_List)
    const [cartItems, setCartItems] = useState(() => readStoredCartItems())
    const [token, setToken] = useState(() => localStorage.getItem(authStorageKey) || "")
    const [currentUser, setCurrentUser] = useState(null)
    const [authLoading, setAuthLoading] = useState(Boolean(localStorage.getItem(authStorageKey)))
    const [reviews, setReviews] = useState([])
    const [ratingsByFood, setRatingsByFood] = useState({})
    const [searchQuery, setSearchQuery] = useState('')

    const getFoodRating = (foodId) => {
        const ratings = ratingsByFood[foodId] || []

        if (!ratings.length) {
            return 4
        }

        const total = ratings.reduce((sum, value) => sum + value, 0)
        return Number((total / ratings.length).toFixed(1))
    }

    const addReview = ({ name, foodId, rating, comment }) => {
        const safeName = String(name || '').trim() || 'Anonymous'
        const safeFoodId = String(foodId || '').trim()
        const safeComment = String(comment || '').trim()
        const safeRating = Math.min(5, Math.max(1, Number(rating) || 1))

        if (!safeFoodId) {
            return
        }

        return apiFetch('/api/review/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: safeName,
                foodId: safeFoodId,
                rating: safeRating,
                comment: safeComment,
            }),
        }).then(({ response, result }) => {
            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Unable to save your review.')
            }

            const createdReview = result.data

            if (!createdReview) {
                throw new Error('Review saved but no review payload was returned.')
            }

            setReviews((current) => [createdReview, ...current])
            setRatingsByFood((current) => ({
                ...current,
                [safeFoodId]: [...(current[safeFoodId] || []), safeRating],
            }))

            return createdReview
        })
    }

    const fetchReviews = async () => {
        try {
            const { response, result } = await apiFetch('/api/review/list')

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Unable to load customer reviews.')
            }

            const fetchedReviews = Array.isArray(result.data) ? result.data : []
            setReviews(fetchedReviews)
            setRatingsByFood(buildRatingsIndex(fetchedReviews))
            return fetchedReviews
        } catch {
            return []
        }
    }

    const addtoCart =(itemId) =>{
        if (!cartItems[itemId]) {
            setCartItems((prev)=>({...prev,[itemId]:1}))
        }
        else{
            setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        }
    }

    const removeFromCart = (itemId) =>{
        setCartItems((prev) => {
            const currentQty = prev[itemId] || 0

            if (currentQty <= 1) {
                const next = { ...prev }
                delete next[itemId]
                return next
            }

            return { ...prev, [itemId]: currentQty - 1 }
        })
    }

    const clearCart = () => {
        setCartItems({})
    }

    useEffect(() => {
        localStorage.setItem(cartStorageKey, JSON.stringify(cartItems))
    }, [cartItems])

    const persistToken = (nextToken) => {
        if (nextToken) {
            localStorage.setItem(authStorageKey, nextToken)
        } else {
            localStorage.removeItem(authStorageKey)
        }

        setToken(nextToken)
    }

    const logout = () => {
        persistToken("")
        setCurrentUser(null)
    }

    const fetchCurrentUser = async (sessionToken = token) => {
        if (!sessionToken) {
            setCurrentUser(null)
            setAuthLoading(false)
            return null
        }

        setAuthLoading(true)

        try {
            const { response, result } = await apiFetch('/api/user/me', {
                headers: {
                    Authorization: `Bearer ${sessionToken}`,
                },
            })

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Unable to load your account.')
            }

            setCurrentUser(result.user)
            return result.user
        } catch {
            logout()
            return null
        } finally {
            setAuthLoading(false)
        }
    }

    const authenticate = async (mode, payload) => {
        const endpoint = mode === 'Sign Up' ? '/api/user/register' : '/api/user/login'
        const { response, result } = await apiFetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })

        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Authentication failed.')
        }

        persistToken(result.token)
        setCurrentUser(result.user)
        setAuthLoading(false)
        return result.user
    }

    const startGuestSession = async () => {
        const { response, result } = await apiFetch('/api/user/guest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Unable to start guest session.')
        }

        persistToken(result.token)
        setCurrentUser(result.user)
        setAuthLoading(false)
        return result.user
    }

    const fetchFoodList = async () => {
        try {
            const { response, result } = await apiFetch('/api/food/list')

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Unable to load menu items.')
            }

            const normalizedFoods = (result.data || []).map((item) => {
                const imagePath = String(item.image || '')
                const isAbsoluteUrl = /^https?:\/\//i.test(imagePath)
                const normalizedImage = isAbsoluteUrl
                    ? imagePath
                    : imagePath
                        ? `${API_URL}/images/${imagePath}`
                        : ''

                return {
                    ...item,
                    image: normalizedImage,
                }
            })

            setFoodList(normalizedFoods)
        } catch {
            // Keep local fallback list if API fetch fails.
            setFoodList(Food_List)
        }
    }

    useEffect(() => {
        fetchCurrentUser(token)
        fetchFoodList()
        fetchReviews()
    }, [])

    const contextValue = {
        Food_List: foodList,
        cartItems,
        setCartItems,
        addtoCart,
        removeFromCart,
        clearCart,
        token,
        currentUser,
        authLoading,
        authenticate,
        startGuestSession,
        fetchCurrentUser,
        logout,
        reviews,
        addReview,
        getFoodRating,
        fetchReviews,
        searchQuery,
        setSearchQuery

   
    }
    return(
        <StoreContext.Provider value ={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}
export default StoreContextProvider
