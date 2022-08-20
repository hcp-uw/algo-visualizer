import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    algorSteps: { steps: [], success: false },
    array: [],
    currentStep: 0,
    prevStep: -1,
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
        // update algor steps usually come with reset current and previous steps
        updateAlgorSteps: (state, action) => {
            state.algorSteps = action.payload.algorSteps;
            state.currentStep = 0;
            state.prevStep = -1;
        },
        updateStep: (state, action) => {
            state.currentStep = action.payload.currentStep;
            state.prevStep = action.payload.prevStep;
        },
        resetSteps: (state) => {
            state.algorSteps = { steps: [], success: false };
            state.currentStep = 0;
            state.prevStep = -1;
        },
    },
});

// Action creators are generated for each case reducer function
export const {
    updateArray,
    updateAlgorSteps,
    updateStep,
    initRandomArray,
    resetSteps,
    updateAlgorName,
} = stateSlice.actions;

export default stateSlice.reducer;
