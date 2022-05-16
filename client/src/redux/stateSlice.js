import { createSlice } from "@reduxjs/toolkit";

// return a random array of length 15, range 0-99, allows duplicate,
// and NOT sorted by default
const makeRandomArray = (sort = false, size = 15, max = 99) => {
    var rands = [];
    var result = [];
    while (rands.length < size) {
        var n = Math.floor(Math.random() * (max + 1));
        rands.push(n);
    }
    if (sort) rands.sort((a, b) => a - b);

    for (var i = 0; i < size; i++) {
        result.push(rands[i]);
    }
    return result;
};

const initialState = {
    algorSteps: { steps: [], success: false },
    array: [],
    currentStep: 0,
    prevStep: -1,
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
} = stateSlice.actions;

export default stateSlice.reducer;
