import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import authReducer from "./slices/authSlice";
import permissionReducer from "./slices/permissionSlice";
import persistConfig from "./persistConfig";

const rootReducer = combineReducers({
  auth: authReducer,
  permissions: permissionReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: {
    persistedReducer,
  },
});

export const persistor = persistStore(store);
