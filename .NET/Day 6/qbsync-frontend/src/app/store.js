import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/store/authSlice.js'
import invoiceReducer from '../features/invoice/store/invoiceSlice.js'

const store = configureStore({
  reducer: {
    auth: authReducer,
    invoice: invoiceReducer
  }
})

export default store
