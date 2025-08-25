import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

// Import slices (we’ll create them later)
import authReducer, { logoutThunk } from "./authSlice";
import productsReducer from "./productsSlice";
import uiReducer from "./uiSlice";
import { setLogoutCallback } from "../services/api";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    ui: uiReducer,
  },
});

setLogoutCallback(() => store.dispatch(logoutThunk()));

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom hooks (so we don’t repeat typing everywhere)
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
