import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { userSlice } from "./user/user.slice";

const rootReducer = combineReducers({
  user: userSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== "production",
});

export type TypeRootState = ReturnType<typeof rootReducer>;
