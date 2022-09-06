import { configureStore } from "@reduxjs/toolkit";
import stateReducer from "./stateSlice";

export const store = configureStore({
    reducer: { global: stateReducer },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;