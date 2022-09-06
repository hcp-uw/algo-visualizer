import React, { useRef, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./LinearSearch.css";
import Controls from "../../components/Controls";
import Array1D from "../../components/Array1D";
import StepTracker from "../../components/StepTracker";
import VisualizerContainer from "../../components/VisualizerContainer";
import { useSelector, useDispatch } from "react-redux";
import AlgorithmPopover from "../../components/AlgorithmPopover";
import { resetSteps, updateAlgorName } from "../../redux/stateSlice";
import { linearSearchDesc } from "../../assets/algorithm-information.js";
import { RootState } from "../../redux/configureStore";
import { LinearSearchResultType } from "../../AlgoResultTypes";

const ALGORITHM_URL = "searches/linearsearch/";

const LinearSearch = () => {
    const algorSteps = useSelector((state:RootState) => state.global.algorSteps) as LinearSearchResultType;
    const currentStep = useSelector((state:RootState) => state.global.currentStep);
    const array = useSelector((state:RootState) => state.global.array);
    const inputBoxRef = useRef<HTMLInputElement>(null);

    const [numInput, setNumInput] = useState<string>("");
    const [currentTarget, setCurrentTarget] = useState<number>();

    const dispatch = useDispatch();
    // reset data upon exiting the page
    useEffect(() => {
        // update the name on first load
        dispatch(updateAlgorName(linearSearchDesc.algorithm));

        return () => {
            dispatch(resetSteps());
        };
    }, []);
    
    // function that update input box
    const updateTargetBoxValue = (e: React.MouseEvent<HTMLElement>) => {
        let inputBox = e.target as HTMLInputElement;
        if (inputBoxRef.current) {
            inputBoxRef.current.value = inputBox.innerHTML;
            setNumInput(inputBox.innerHTML);
        }
    };

    /**
     * Decide how to draw blocks on the array.
     * Use by passing to the Array1D or any other visual components.
     *
     * We expect the json returned from the backend to include an
     * array of steps and a success flag.
     *
     * Each step also contains a description to describe the step,
     * used for the logger.
     *
     * For linear search, each step just include the index of focused element.
     *
     * algorSteps.steps[i] =
     *                          {
     *                              step: index of focused element at step i
     *                          }
     *
     * @returns react components
     */
    const drawBlocks = () => {
        // react can try to render before the backend return the steps (when page first loaded)
        // so a guard is necessary
        let currentHighlightId =
            algorSteps.steps.length > 0 && currentStep > 0
                ? algorSteps.steps[currentStep - 1].element
                : undefined;
        // for each element in the array
        return array.map((value, id) => {
            // first decide the highlight style for the element
            let style = "";
            // undefined guard
            if (currentHighlightId !== undefined) {
                // highlight if the current element is focused
                if (currentHighlightId === id) {
                    style = " highlight";
                }
                // else if we reach the end of search (marked as -1)
                else if (
                    currentHighlightId === -1 &&
                    id === algorSteps.steps[currentStep - 2].element
                ) {
                    style = algorSteps.success
                        ? " highlight-success"
                        : " highlight-error";
                }
            }
            // return a react component
            return (
                <td
                    className={"value-block value-block-hover" + style}
                    key={id}
                    id={id.toString()}
                    onClick={updateTargetBoxValue.bind(this)}
                >
                    {value}
                </td>
            );
        });
    };

    return (
        <div className="content">
            <div className="centered">
                <AlgorithmPopover data={linearSearchDesc} />
            </div>

            <VisualizerContainer>
                <Array1D drawBlocks={drawBlocks} />
            </VisualizerContainer>

            <Controls
                numInput={numInput}
                algorithmUrl={ALGORITHM_URL}
                setCurrentTarget={setCurrentTarget}
                searchInputBox={
                    <div className="input-container">
                        <input
                            ref={inputBoxRef}
                            className="num-input"
                            type="number"
                            placeholder="Search for"
                            value={numInput}
                            onChange={(e) => {
                                setNumInput(e.target.value);
                            }}
                        ></input>
                    </div>
                }
            />
            <div className="centered">Current target: {currentTarget}</div>
            <StepTracker />
        </div>
    );
};

export default LinearSearch;
