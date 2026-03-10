import { configureStore } from '@reduxjs/toolkit'
import themeReducer    from './slices/themeSlice'
import employeeReducer from './slices/employeeSlice'
import uiReducer       from './slices/uiSlice'
import toastReducer    from './slices/toastSlice'

export const store = configureStore({
  reducer: {
    theme:    themeReducer,
    employee: employeeReducer,
    ui:       uiReducer,
    toast:    toastReducer,
  },
})

export default store
