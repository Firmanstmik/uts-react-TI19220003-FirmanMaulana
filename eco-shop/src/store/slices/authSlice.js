import { createSlice } from '@reduxjs/toolkit'

const STORAGE_KEY = 'ecoUser'

const getStorage = () => {
  if (typeof window === 'undefined') {
    return null
  }
  return window.localStorage
}

const loadUser = () => {
  const storage = getStorage()
  if (!storage) return null
  try {
    const stored = storage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error('Failed to load user from storage', error)
    return null
  }
}

const persistUser = (user) => {
  const storage = getStorage()
  if (!storage) return
  try {
    if (user) {
      storage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      storage.removeItem(STORAGE_KEY)
    }
  } catch (error) {
    console.error('Failed to persist user to storage', error)
  }
}

const storedUser = loadUser()

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: storedUser,
    isAuthenticated: Boolean(storedUser),
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
      persistUser(action.payload)
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      persistUser(null)
    },
    register: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
      persistUser(action.payload)
    },
    updateProfile: (state, action) => {
      if (!state.user) return
      state.user = { ...state.user, ...action.payload }
      persistUser(state.user)
    },
  },
})

export const { login, logout, register, updateProfile } = authSlice.actions
export default authSlice.reducer

