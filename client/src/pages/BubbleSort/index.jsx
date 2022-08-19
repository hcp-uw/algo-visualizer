import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./BubbleSort.css";
import Controls from "../../components/Controls";
import Array1D from "../../components/Array1D";
import AlgoFetcher from "../../apis/AlgoFetcher";
import StepTracker from "../../components/StepTracker";
import { useSelector, useDispatch } from "react-redux";
import AlgorithmPopover from "../../components/AlgorithmPopover"
import {
    updateAlgorSteps,
    resetSteps,
    updateAlgorName,
} from "../../redux/stateSlice";
import VisualizerContainer from "../../components/VisualizerContainer";

const ALGORITHM_URL = "sorts/bubblesort/";
const ALGORITHM_NAME = "Bubble Sort";

const BubbleSort = () => {
    const algorSteps = useSelector((state) => state.global.algorSteps);
    const currentStep = useSelector((state) => state.global.currentStep);
    const array = useSelector((state) => state.global.array);
    const currentName = useSelector((state) => state.global.algorithmName);
    const dispatch = useDispatch();

    // swaps[i] is the boolean if a swap is happening at step i
    const [swaps, setSwaps] = useState([]);

    // reset data upon exiting the page
    useEffect(() => {
        // update the name on first load
        dispatch(updateAlgorName(ALGORITHM_NAME));

        return () => {
            dispatch(resetSteps());
        };
    }, []);

    // slightly different from the prototype: update swap count after receiving
    // response from backend
    const doAlgorithm = async (arr) => {
        let data = { array: arr };

        try {
            let response = await AlgoFetcher.post(ALGORITHM_URL, data);
            // update swap
            let c = 0;
            let s = [];
            for (let i = 0; i < response.data.result.steps.length; i++) {
                c += response.data.result.steps[i].swapped ? 1 : 0;
                s.push(c);
            }
            s[-1] = 0;
            setSwaps(s);
            dispatch(updateAlgorSteps({ algorSteps: response.data.result }));
        } catch (err) {
            console.log(err);
        }
    };

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
            currentName === ALGORITHM_NAME;

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
                    id={id}
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
                <div className="container">
                    <div className="row">
                        <div className="col-10">
                            <h2>Bubble Sort</h2>
                        </div>
                        <AlgorithmPopover 
                            data = {
                                {
                                    algorithm: "Bubble Sort",
                                    title : "Bubble Sort compares adjacent elements and swaps them if they are in the wrong order",
                                    description : [
                                        "Worst Complexity: O(n^2)",
                                        "In Practice Complexity: O(n^2)",
                                        "Best Complexity: O(n)",
                                        "Space Complexity: O(1)",
                                        "Stable: Yes"
                                    ]
                                }

                            }
                        />
                    </div>
                <h2>{ALGORITHM_NAME}</h2>
            </div>
            {/*
                <div className="info">
                    <button className="btn">Extra Info right here</button>
                </div>
            </div>

            <VisualizerContainer>
                <Array1D drawBlocks={drawBlocks} />
            </VisualizerContainer>

            <div className="swap-counter-container">
                <span>
                    Swaps:{" "}
                    {swaps[currentStep - 1] != null
                        ? swaps[currentStep - 1]
                        : 0}
                </span>
            </div>

            <StepTracker></StepTracker>

            <Controls doAlgorithm={doAlgorithm} algorithmUrl={ALGORITHM_URL} />
        </div>
    );
};

export default BubbleSort;
