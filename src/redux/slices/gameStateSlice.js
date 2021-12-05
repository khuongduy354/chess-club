import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reset: false,
};

export const gameStateSlice = createSlice({
  name: "gameState",
  initialState,
  reducers: {
    setReset: (state, action) => {
      state.reset = action.payload;
    },
  },
});

export const { setReset } = gameStateSlice.actions;
export default gameStateSlice.reducer;
