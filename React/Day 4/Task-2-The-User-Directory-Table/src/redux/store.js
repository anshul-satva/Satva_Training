import userReducer from './slices/usersSlice'
import { configureStore } from '@reduxjs/toolkit'


export const store = configureStore({
    reducer : {
        users : userReducer,
    }
})