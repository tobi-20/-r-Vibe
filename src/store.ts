import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "user/signup/pending",
          "user/signup/fulfilled",
          "user/signup/rejected",
          "user/login/pending",
          "user/login/fulfilled",
          "user/login/rejected",
        ],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
