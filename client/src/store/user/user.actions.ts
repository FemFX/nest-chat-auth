import { $api } from "@/utils/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export interface IData {
  username: string;
  password: string;
}

export const login = createAsyncThunk(
  "auth/login",
  async (dto: IData, thunkAPI) => {
    try {
      const { data } = await $api.post("/auth/login", dto);
      return data;
    } catch (err) {
      console.log(err);
      thunkAPI.rejectWithValue(err);
    }
  }
);
export const register = createAsyncThunk(
  "auth/login",
  async (dto: IData, thunkAPI) => {
    try {
      const { data } = await $api.post("/auth/login", dto);
      return data;
    } catch (err) {
      console.log(err);
      thunkAPI.rejectWithValue(err);
    }
  }
);
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, thunkAPI) => {
    try {
      const { data } = await $api.post("/auth");
      return data;
    } catch (err) {
      console.log(err);
      thunkAPI.rejectWithValue(err);
    }
  }
);
export const logout = createAsyncThunk(
  "auth/login",
  async (dto: IData, thunkAPI) => {
    try {
      const { data } = await $api.post("/auth/login", dto);
      return data;
    } catch (err) {
      console.log(err);
      thunkAPI.rejectWithValue(err);
    }
  }
);
