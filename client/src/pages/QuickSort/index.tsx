import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./QuickSort.css";
import Controls from "../../components/Controls";
import Array1D from "../../components/Array1D";
import StepTracker from "../../components/StepTracker";
import VisualizerContainer from "../../components/VisualizerContainer";
import { useSelector, useDispatch } from "react-redux";
import { resetSteps, updateAlgorName } from "../../redux/stateSlice";

import AlgorithmPopover from "../../components/AlgorithmPopover";
import { quickSortDesc } from "../../assets/algorithm-information";
import { RootState } from "../../redux/configureStore";
import { QuickSortResultType } from "../../AlgoResultTypes";
import { ExtraData } from "../../CommonTypes";

const ALGORITHM_URL = "sorts/quicksort/";

const QuickSort = () => {
    const algorSteps = useSelector(
        (state: RootState) => state.global.algorSteps
    ) as QuickSortResultType;
    const currentStep = useSelector(
        (state: RootState) => state.global.currentStep
    );
    const array = useSelector((state: RootState) => state.global.array);
    const currentName = useSelector(
        (state: RootState) => state.global.algorithmName
    );
    const dispatch = useDispatch();

    // swaps[i] is number of swaps at step i
    const [swaps, setSwaps] = useState<number[]>([]);

    const extraData: ExtraData = [
        { key: "swap", data: swaps, updater: setSwaps },
    ];

    // reset data upon exiting the page
    useEffect(() => {
        // update the name on first load
        dispatch(updateAlgorName(quickSortDesc.algorithm));

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
     * algorSteps.steps[i] = {
     *      array: number[];
     *      leftHighlight: number; // color this
     *      rightHighlight: number; // color this
     *      sorted: number[]; // low priority on coloring
     *      swapped: boolean; //  low priority on coloring
     *      description: string;
     *      pivotIndex: number; // color this
     * }
     *
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
            currentName === quickSortDesc.algorithm;
        
        if (isStepAvailable) {
            // var steps = algorSteps.steps;
            // var currentArrayStep = currentStep - 1;
            // var arr: number[] = steps[currentArrayStep].array;
            // var leftHighlight: number = steps[currentArrayStep].leftHighlight;
            // var rightHighlight: number = steps[currentArrayStep].rightHighlight;
            // var swapped: boolean = steps[currentArrayStep].swapped;
            // var sorted: number[] = steps[currentArrayStep].sorted;
            // var pivotIndex: number = steps[currentArrayStep].pivotIndex;
            //     array: number[];
            var steps = algorSteps.steps;
            var currentArrayStep = currentStep - 1;
            var subArrayStartIndex = 0; // color this
            var arr: number[] = steps[currentArrayStep].array;
            var leftPointer: number = steps[currentArrayStep].leftPointer;
            var rightPointer: number = steps[currentArrayStep].rightPointer;
            var subArrayEndIndex = arr.length; // color this
            // leftPointer: number;
            // rightPointer: number;
            // sorted: boolean; // low priority on coloring
            // swapped: boolean; //  low priority on coloring
            // swapCount: number;
            var description = steps[currentArrayStep].description;
            var pivotIndex = steps[currentArrayStep].pivotIndex; // color this

            
        } else {
            // default array from contianing numbers from 0 to array.length - 1
            arr = [...Array(array.length).keys()];
        }
        
        console.log(algorSteps.steps);
        // more needs to happen!
        return array.map((value, id) => {
            var style = "";
            // if (isStepAvailable) {
            //     if (highlight.includes(id)) {
            //         style = swapped ? " highlight-error" : " highlight";
            //     } else if (sorted.includes(id)) {
            //         style = " highlight-success";
            //     } else {
            //         style = " highlight-domain";
            //     }
            // } 
            if (isStepAvailable) {
                if (pivotIndex == id) {
                    style = " highlight-success";
                }
                if (leftPointer == id) {
                    style = " highlight-success";
                }
                if (rightPointer == id) {
                    style = " highlight-success";
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
                <AlgorithmPopover data={quickSortDesc} />
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

export default QuickSort;
