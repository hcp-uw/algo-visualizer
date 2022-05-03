import { configureStore } from "@reduxjs/toolkit";
import stateReducer from "./stateSlice";

export const store = configureStore({
    reducer: { global: stateReducer },
});
