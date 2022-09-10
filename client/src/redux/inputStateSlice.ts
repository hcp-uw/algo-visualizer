import { createSlice } from "@reduxjs/toolkit";

const initialState: {
    singleInput: string;
    prevSingleInput: string;
    arrayInput: string;
    prevArrayInput: string;
    isArrayInputValid: boolean;
    graphInput: string;
    prevGraphInput: string;
} = {
    singleInput: "",
    prevSingleInput: "",
    arrayInput: "",
    prevArrayInput: "",
    isArrayInputValid: true,
    graphInput: "",
    prevGraphInput: "",
};

export const inputStateSlice = createSlice({
    name: "inputState",
    initialState,
    reducers: {
        // Redux Toolkit allows us to write "mutating" logic in reducers. It
        // doesn't actually mutate the state because it uses the Immer library,
        // which detects changes to a "draft state" and produces a brand new
        // immutable state based off those changes
        updateSingleInput: (state, action) => {
            state.singleInput = action.payload;
        },
        updatePrevSingleInput: (state, action) => {
            state.prevSingleInput = action.payload;
        },
        updateArrayInput: (state, action) => {
            state.arrayInput = action.payload;
        },
        updatePrevArrayInput: (state, action) => {
            state.prevArrayInput = action.payload;
        },
        updateIsArrayInputValid: (state, action) => {
            state.isArrayInputValid = action.payload;
        },
        updateGraphInput: (state, action) => {
            state.graphInput = action.payload;
        },
        updatePrevGraphInput: (state, action) => {
            state.prevGraphInput = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const {
    updateSingleInput,
    updatePrevSingleInput,
    updateArrayInput,
    updatePrevArrayInput,
    updateIsArrayInputValid,
    updateGraphInput,
    updatePrevGraphInput,
} = inputStateSlice.actions;

export default inputStateSlice.reducer;
