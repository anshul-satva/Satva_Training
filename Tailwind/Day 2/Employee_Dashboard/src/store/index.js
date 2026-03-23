import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // uses localStorage

import themeReducer    from './slices/themeSlice'
import employeeReducer from './slices/employeeSlice'
import uiReducer       from './slices/uiSlice'
import toastReducer    from './slices/toastSlice'
import authReducer     from './slices/authSlice'

const authPersistConfig = {
  key: 'auth',
  storage,
}

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer)

export const store = configureStore({
  reducer: {
    theme:    themeReducer,
    employee: employeeReducer,
    ui:       uiReducer,
    toast:    toastReducer,
    auth:     persistedAuthReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)
export default store