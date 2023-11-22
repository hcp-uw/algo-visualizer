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
const PIVOT_HEIGHT = -100;
const SUBARRAY_HEIGHT = 100;

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
            var steps = algorSteps.steps;
            var currentArrayStep = currentStep - 1;
            var subArrayStartIndex = steps[currentArrayStep].subArrayStartIndex; // color this
            var arr: number[] = steps[currentArrayStep].array;
            var leftPointer: number = steps[currentArrayStep].leftPointer;
            var rightPointer: number = steps[currentArrayStep].rightPointer;
            var subArrayEndIndex = steps[currentArrayStep].subArrayEndIndex; // color this
            var description = steps[currentArrayStep].description;
            var pivotIndex = steps[currentArrayStep].pivotIndex; // color this
            var sorted: boolean = steps[currentArrayStep].sorted;
            console.log(algorSteps.steps[currentArrayStep]);

        } else {
            // default array from contianing numbers from 0 to array.length - 1
            arr = [...Array(array.length).keys()];
        }

        // more needs to happen!
        return array.map((value, id) => {
            var style = "";
            var height = 0
            let x = arr.indexOf(id) - id;

            if (isStepAvailable) {
                if (sorted) {
                    style = " highlight-success";
                }
                else if (pivotIndex == arr.indexOf(id)) {
                    style = " highlight-compare";
                    height = PIVOT_HEIGHT;
                    if (rightPointer != -1) {
                        x = rightPointer - id
                    }
                    console.log("right pointer" + rightPointer)
                    console.log("id " + id)
                    console.log("pivot x " + x)
                }
                else if (leftPointer == arr.indexOf(id)) {
                    style = " highlight-compare";
                }
                else if (rightPointer == arr.indexOf(id)) {
                    style = " highlight-compare";
                }
                else if (subArrayStartIndex <= arr.indexOf(id) && arr.indexOf(id) < leftPointer) {
                    style = " highlight-minflag";
                }
                else if (subArrayStartIndex <= arr.indexOf(id) && arr.indexOf(id) < subArrayEndIndex) {
                    style = " highlight-domain"
                    height = SUBARRAY_HEIGHT;
                }
            }

            return (
                <td
                    className={"value-block" + style}
                    key={id}
                    id={id.toString()}
                    style={{
                        transform: `translate(${x * 58}px, ${height}px)`,
                    }}
                >
                    {value}
                    {/* Display an index below the box if level > 0 */}
                    {isStepAvailable && height == -100 ? (
                        <div
                            style={{
                                top: "50px",
                                position: "absolute",
                                textAlign: "center",
                                width: "100%",
                            }}
                            className="index-row"
                        >
                            {"Pivot"}
                        </div>
                    ) : null}
                </td>
            );
        });
    };

    return (
        <div className="content">
            <div className="centered">
                <AlgorithmPopover data={quickSortDesc} />
            </div>

            <VisualizerContainer
                height={250}
                scale={0.70}
                initPosition={{ x: 0, y: 100 }}>
                <Array1D drawBlocks={drawBlocks} />
            </VisualizerContainer>

            <Controls
                extraData={extraData}
                algorithmUrl={ALGORITHM_URL}
                require={["arrayInput"]}
                isQuickSort={true}
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