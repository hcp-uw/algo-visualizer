import { createSlice } from "@reduxjs/toolkit";
import { Edge } from "../CommonTypes";

const initialState: {
    singleInput: string;
    prevSingleInput: string;
    arrayInput: string;
    prevArrayInput: string;
    isArrayInputValid: boolean;
    graphNodes: string[]; // array of node ids
    graphEdges: Edge[];
    isGraphInputChanged: boolean;
    //prevGraphInput: string;
} = {
    singleInput: "",
    prevSingleInput: "",
    arrayInput: "",
    prevArrayInput: "",
    isArrayInputValid: true,
    graphNodes: [],
    graphEdges: [],
    isGraphInputChanged: false,
    //prevGraphInput: "",
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
        resetSingleInput: (state) => {
            state.singleInput = "";
            state.prevSingleInput = "";
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
        resetArrayInput: (state) => {
            state.arrayInput = "";
            state.prevArrayInput = "";
            state.isArrayInputValid = true;
        },
        updateGraphNodes: (state, action) => {
            state.graphNodes = action.payload;
        },
        updateGraphEdges: (state, action) => {
            state.graphEdges = action.payload;
        },
        updateIsGraphInputChanged: (state, action) => {
            state.isGraphInputChanged = action.payload;
        },
        resetGraphInput: (state) => {
            state.graphNodes = [];
            state.graphEdges = [];
            state.isGraphInputChanged = false;
        },
        // updatePrevGraphInput: (state, action) => {
        //     state.prevGraphInput = action.payload;
        // },
    },
});

// Action creators are generated for each case reducer function
export const {
    updateSingleInput,
    updatePrevSingleInput,
    resetSingleInput,
    updateArrayInput,
    updatePrevArrayInput,
    updateIsArrayInputValid,
    resetArrayInput,
    updateGraphNodes,
    updateGraphEdges,
    updateIsGraphInputChanged,
    resetGraphInput,
} = inputStateSlice.actions;

export default inputStateSlice.reducer;
