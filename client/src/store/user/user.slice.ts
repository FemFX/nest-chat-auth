import { createSlice } from "@reduxjs/toolkit";
import { checkAuth, login } from "./user.actions";
import { setCookie } from "nookies";

export interface IInitialState {
  user: any;
  error: any;
  isLoading: boolean;
}

const initialState: IInitialState = {
  user: null,
  isLoading: false,
  error: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        // localStorage.setItem("token", action.payload.accessToken);
        setCookie(null, "token", action.payload.accessToken);
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.error;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        // localStorage.setItem("token", action.payload.accessToken);
        // setCookie(null, "token", action.payload.accessToken);
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.error = action.error;
      });
  },
});
