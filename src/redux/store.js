import { configureStore } from "@reduxjs/toolkit";
import gameStateReducer from "./slices/gameStateSlice";
export const store = configureStore({
  reducer: {
    gameState: gameStateReducer,
  },
});
