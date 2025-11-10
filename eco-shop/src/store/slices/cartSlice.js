import { createSlice } from '@reduxjs/toolkit'

const getStorage = () => {
  if (typeof window === 'undefined') {
    return null
  }
  return window.localStorage
}

const loadCartItems = () => {
  const storage = getStorage()
  if (!storage) return []
  try {
    const stored = storage.getItem('cartItems')
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Failed to load cart items from storage', error)
    return []
  }
}

const persistCartItems = (items) => {
  const storage = getStorage()
  if (!storage) return
  try {
    if (items.length) {
      storage.setItem('cartItems', JSON.stringify(items))
    } else {
      storage.removeItem('cartItems')
    }
  } catch (error) {
    console.error('Failed to persist cart items to storage', error)
  }
}

const calculateTotals = (items) =>
  items.reduce(
    (acc, item) => {
      acc.totalQuantity += item.quantity
      acc.totalPrice += item.quantity * item.price
      return acc
    },
    { totalQuantity: 0, totalPrice: 0 },
  )

const initialItems = loadCartItems()
const initialTotals = calculateTotals(initialItems)

const initialState = {
  items: initialItems,
  totalQuantity: initialTotals.totalQuantity,
  totalPrice: initialTotals.totalPrice,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload
      const existing = state.items.find((product) => product.id === item.id)
      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({ ...item, quantity: 1 })
      }
      const totals = calculateTotals(state.items)
      state.totalQuantity = totals.totalQuantity
      state.totalPrice = totals.totalPrice
      persistCartItems(state.items)
    },
    removeFromCart: (state, action) => {
      const id = action.payload
      state.items = state.items.filter((item) => item.id !== id)
      const totals = calculateTotals(state.items)
      state.totalQuantity = totals.totalQuantity
      state.totalPrice = totals.totalPrice
      persistCartItems(state.items)
    },
    clearCart: (state) => {
      state.items = []
      state.totalQuantity = 0
      state.totalPrice = 0
      persistCartItems(state.items)
    },
    increaseQty: (state, action) => {
      const id = action.payload
      const existing = state.items.find((item) => item.id === id)
      if (existing) {
        existing.quantity += 1
        const totals = calculateTotals(state.items)
        state.totalQuantity = totals.totalQuantity
        state.totalPrice = totals.totalPrice
        persistCartItems(state.items)
      }
    },
    decreaseQty: (state, action) => {
      const id = action.payload
      const existing = state.items.find((item) => item.id === id)
      if (existing) {
        existing.quantity -= 1
        if (existing.quantity <= 0) {
          state.items = state.items.filter((item) => item.id !== id)
        }
        const totals = calculateTotals(state.items)
        state.totalQuantity = totals.totalQuantity
        state.totalPrice = totals.totalPrice
        persistCartItems(state.items)
      }
    },
  },
})

export const { addToCart, removeFromCart, clearCart, increaseQty, decreaseQty } = cartSlice.actions
export default cartSlice.reducer

