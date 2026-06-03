import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice.js";
import OwnerSlice from "./OwnerSlice.js";

export const store = configureStore({
  reducer: {
    user: userSlice,
    owner: OwnerSlice,
  },
});
