import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen:        true,
    notificationOpen:   false,
    mobileMenuOpen:     false,
    loading:            false,
  },
  reducers: {
    toggleSidebar(state)          { state.sidebarOpen      = !state.sidebarOpen },
    setSidebarOpen(state, action) { state.sidebarOpen      = action.payload },
    toggleNotifications(state)    { state.notificationOpen = !state.notificationOpen },
    closeNotifications(state)     { state.notificationOpen = false },
    toggleMobileMenu(state)       { state.mobileMenuOpen   = !state.mobileMenuOpen },
    closeMobileMenu(state)        { state.mobileMenuOpen   = false },
    setLoading(state, action)     { state.loading          = action.payload },
  },
})

export const {
  toggleSidebar, setSidebarOpen,
  toggleNotifications, closeNotifications,
  toggleMobileMenu, closeMobileMenu,
  setLoading,
} = uiSlice.actions

export default uiSlice.reducer
