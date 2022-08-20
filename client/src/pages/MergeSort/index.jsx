import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./MergeSort.css";
import Controls from "../../components/Controls";
import Array1D from "../../components/Array1D";
import AlgoFetcher from "../../apis/AlgoFetcher";
import StepTracker from "../../components/StepTracker";
import VisualizerContainer from "../../components/VisualizerContainer";
import { useSelector, useDispatch } from "react-redux";
import {
    updateAlgorSteps,
    resetSteps,
    updateAlgorName,
} from "../../redux/stateSlice";

import AlgorithmPopover from "../../components/AlgorithmPopover";
import { mergeSortDesc } from "../../assets/algorithm-information";

const ALGORITHM_URL = "sorts/mergesort/";

const MergeSort = () => {
    const algorSteps = useSelector((state) => state.global.algorSteps);
    const currentStep = useSelector((state) => state.global.currentStep);
    const array = useSelector((state) => state.global.array);
    const currentName = useSelector((state) => state.global.algorithmName);
    const dispatch = useDispatch();

    // swaps[i] is the boolean if a swap is happening at step i
    const [compares, setCompares] = useState([]);

    // reset data upon exiting the page
    useEffect(() => {
        console.log("GOT HERE");
        // update the name on first load
        dispatch(updateAlgorName(mergeSortDesc.algorithm));

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
            // update compareCount
            let c = 0;
            let s = [];
            for (let i = 0; i < response.data.result.steps.length; i++) {
                c += response.data.result.steps[i].swapped ? 1 : 0;
                s.push(c);
            }
            s[-1] = 0;
            setCompares(s);
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
     * For merge sort, each step includes the following:
     *
     * algorSteps.steps[i] = //TODO NEEDS FIXING
     *                          {
     *                              array(Array): array of indexes. the state of the entire array at the ith step
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
        const step = algorSteps.steps[currentStep - 1];
        let isStepAvailable =
            step != null &&
            step.positions != null &&
            // IF THE CURRENT ALGORITHM NAME IS MATCHING
            currentName === mergeSortDesc.algorithm;

        if (isStepAvailable) {
            var highlight = step.highlight;
            var swapped = step.swapped;
            var comparing = step.comparing;
            var sorted = step.sorted;
        }

        // for each element in the array at the current step
        return array.map((value, id) => {
            var style = "";
            if (isStepAvailable) {
                if (sorted) {
                    style = " highlight-success";
                } else if (highlight.includes(id)) {
                    if (comparing) style = " highlight-compare";
                    else if (swapped) style = " highlight-error";
                    else style = " highlight";
                } else {
                    style = " highlight-domain";
                }
            }

            let level = isStepAvailable ? step.positions[id].level : 0;

            let maxSubarraySize = Math.ceil(array.length / Math.pow(2, level));
            let treePosition = isStepAvailable ? step.positions[id].treePos : 0;

            let x = isStepAvailable
                ? // relative position in subarray
                  step.positions[id].pos +
                  // position of subarray = position in level * max length of subarray @ level + spacing
                  (treePosition - Math.pow(2, level) + 1) * maxSubarraySize +
                  // subarray on the left get pushed further left, right further right
                  (treePosition > 0
                      ? 0.5 * Math.pow(-1, treePosition % 2) - Math.log2(level)
                      : 0)
                : id;

            let y = isStepAvailable ? level : 0;

            return (
                <td
                    className={"value-block" + style}
                    id={id}
                    key={id}
                    style={{
                        transform: `translate(${(x - id) * 58}px, ${y * 95}px)`,
                    }}
                >
                    {value}
                    {/* Display an index below the box if level > 0 */}
                    {isStepAvailable && step.positions[id].level > 0 ? (
                        <div
                            style={{
                                top: "50px",
                                position: "absolute",
                                textAlign: "center",
                                width: "100%",
                            }}
                            className="index-row"
                        >
                            {step.positions[id].pos}
                        </div>
                    ) : null}
                </td>
            );
        });
    };

    return (
        <div className="content">
            <div className="centered">
                <AlgorithmPopover data={mergeSortDesc} />
            </div>
            {/*
                <div className="info">
                    <button className="btn">Extra Info right here</button>
                </div>
                */}

            <VisualizerContainer
                height={400}
                scale={0.7}
                //initPosition={{ x: -28, y: -200 }}
            >
                <Array1D drawBlocks={drawBlocks} />
            </VisualizerContainer>

            <Controls doAlgorithm={doAlgorithm} algorithmUrl={ALGORITHM_URL} />

            <div className="swap-counter-container">
                <span>
                    Comparisons:{" "}
                    {compares[currentStep - 1] != null
                        ? compares[currentStep - 1]
                        : 0}
                </span>
            </div>

            <StepTracker></StepTracker>
        </div>
    );
};

export default MergeSort;
