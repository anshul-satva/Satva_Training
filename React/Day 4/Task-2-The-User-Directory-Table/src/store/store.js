import userReducer from './usersSlice'
import { configureStore } from '@reduxjs/toolkit'


export const store = configureStore({
    reducer : {
        users : userReducer,
    }
})