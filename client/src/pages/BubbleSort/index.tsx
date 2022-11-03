import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./BubbleSort.css";
import Controls from "../../components/Controls";
import Array1D from "../../components/Array1D";
import StepTracker from "../../components/StepTracker";
import { useSelector, useDispatch } from "react-redux";
import AlgorithmPopover from "../../components/AlgorithmPopover";
import { resetSteps, updateAlgorName } from "../../redux/stateSlice";
import VisualizerContainer from "../../components/VisualizerContainer";
import { bubbleSortDesc } from "../../assets/algorithm-information.js";
import { RootState } from "../../redux/configureStore";
import { BubbleSortResultType } from "../../AlgoResultTypes";
import { ExtraData } from "../../CommonTypes";

const ALGORITHM_URL = "sorts/bubblesort/";

const BubbleSort = () => {
    const algorSteps = useSelector(
        (state: RootState) => state.global.algorSteps
    ) as BubbleSortResultType;
    const currentStep = useSelector(
        (state: RootState) => state.global.currentStep
    );
    const array = useSelector((state: RootState) => state.global.array);
    const currentName = useSelector(
        (state: RootState) => state.global.algorithmName
    );
    const dispatch = useDispatch();

    // swaps[i] is the number of swaps at step i
    const [swaps, setSwaps] = useState<Number[]>([]);

    const extraData: ExtraData = [
        { key: "swap", data: swaps, updater: setSwaps },
    ];

    // reset data upon exiting the page
    useEffect(() => {
        // update the name on first load
        dispatch(updateAlgorName(bubbleSortDesc.algorithm));

        return () => {
            dispatch(resetSteps());
        };
    }, []);

    /**
     * Decide how to draw blocks on the array.
     * Use by passing to the Array1D or any other visual components.
     *
     * We expect the json returned from the backend to include an
     * array of steps.
     *
     * Each step also contains a description to describe the step,
     * used for the logger.
     *
     * For bubble sort, each step includes the following:
     *
     * algorSteps.steps[i] =
     *                          {
     *                              array(Array):  array of indexes. the state of the entire array at the ith step
     *                              highlight(Array): the indexes of elements that are currently focused
     *                              sorted(Array): the indexes of elements that are sorted
     *                              swapped(Bool): mark if the ith step is swapping two elements
     *                              swapCount(Number): the count of total swaps up to step ith
     *                          }
     *
     * @returns react components
     */
    const drawBlocks = () => {
        // when page loaded at first or in case steps are missing
        let isStepAvailable =
            // the steps are loaded
            algorSteps.steps.length > 0 &&
            // if the algorithm is in progress (step 0: default state)
            currentStep > 0 &&
            // IF THE CURRENT ALGORITHM NAME IS MATCHING
            currentName === bubbleSortDesc.algorithm;

        if (isStepAvailable) {
            var steps = algorSteps.steps;
            var currentArrayStep = currentStep - 1;
            var arr = steps[currentArrayStep].array;
            var highlight = steps[currentArrayStep].highlight;
            var swapped = steps[currentArrayStep].swapped;
            var sorted = steps[currentArrayStep].sorted;
        } else {
            // default array from contianing numbers from 0 to array.length -1
            arr = [...Array(array.length).keys()];
        }
        // for each element in the array at the current step
        return array.map((value, id) => {
            var style = "";
            if (isStepAvailable) {
                if (highlight.includes(id)) {
                    style = swapped ? " highlight-error" : " highlight";
                } else if (sorted.includes(id)) {
                    style = " highlight-success";
                } else {
                    style = " highlight-domain";
                }
            }

            let x = arr.indexOf(id) - id;

            return (
                <td
                    className={"value-block" + style}
                    key={id}
                    id={id.toString()}
                    style={{
                        transform: `translate(${x * 58}px, 0px)`,
                    }}
                >
                    {value}
                </td>
            );
        });
    };

    return (
        <div className="content">
            <div className="centered">
                <AlgorithmPopover data={bubbleSortDesc} />
            </div>

            <VisualizerContainer>
                <Array1D drawBlocks={drawBlocks} />
            </VisualizerContainer>

            <Controls
                extraData={extraData}
                algorithmUrl={ALGORITHM_URL}
                require={["arrayInput"]}
            />

            <div className="swap-counter-container">
                <span>
                    Swaps:{" "}
                    {swaps[currentStep - 1] != null
                        ? swaps[currentStep - 1]
                        : 0}
                </span>
            </div>

            <StepTracker></StepTracker>
        </div>
    );
};

export default BubbleSort;
