import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./modalSlice";
import userReducer from "./userSlice";
import { booksApi } from "./booksApi";

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    user: userReducer,
    // Computed key, so it always matches booksApi.reducerPath.
    [booksApi.reducerPath]: booksApi.reducer,
  },
  // RTK Query's middleware is what provides caching and invalidation.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(booksApi.middleware),
});
