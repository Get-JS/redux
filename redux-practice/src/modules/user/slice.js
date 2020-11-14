import { createSlice } from "@reduxjs/toolkit";

const name = "USER";

const initialState = [
  { id: "0", name: "Tianna Jenkins" },
  { id: "1", name: "Kevin Grant" },
  { id: "2", name: "Madison Price" },
];

const slice = createSlice({
  name,
  initialState,
  reducers: {},
});

export const USER = slice.name;
export const userReducer = slice.reducer;
export const userAction = slice.actions;
