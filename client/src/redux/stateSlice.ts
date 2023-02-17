import { createSlice } from "@reduxjs/toolkit";
import { AlgorithmResultType } from "../AlgoResultTypes";

const initialState: {
    algorSteps: AlgorithmResultType;
    array: number[];
    currentStep: number;
    algorithmName: string;
} = {
    algorSteps: { steps: [], success: false },
    array: [],
    currentStep: 0,
    algorithmName: "",
};

export const stateSlice = createSlice({
    name: "state",
    initialState,
    reducers: {
        // Redux Toolkit allows us to write "mutating" logic in reducers. It
        // doesn't actually mutate the state because it uses the Immer library,
        // which detects changes to a "draft state" and produces a brand new
        // immutable state based off those changes
        updateArray: (state, action) => {
            state.array = action.payload;
        },
        updateAlgorName: (state, action) => {
            state.algorithmName = action.payload;
        },
        // update algor steps usually come with reset current step
        updateAlgorSteps: (state, action) => {
            state.algorSteps = action.payload.algorSteps;
            state.currentStep = 0;
        },
        updateStep: (state, action) => {
            state.currentStep = action.payload.currentStep;
        },
        resetSteps: (state) => {
            state.algorSteps = { steps: [], success: false };
            state.currentStep = 0;
        },
    },
});

// Action creators are generated for each case reducer function
export const {
    updateArray,
    updateAlgorSteps,
    updateStep,
    resetSteps,
    updateAlgorName,
} = stateSlice.actions;

export default stateSlice.reducer;
