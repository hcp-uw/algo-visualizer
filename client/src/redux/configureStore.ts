import { configureStore } from "@reduxjs/toolkit";
import inputStateReducer from "./inputStateSlice";
import stateReducer from "./stateSlice";

export const store = configureStore({
    reducer: { global: stateReducer, input: inputStateReducer },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
