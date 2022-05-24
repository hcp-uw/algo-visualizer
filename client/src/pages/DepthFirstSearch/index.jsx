import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./DepthFirstSearch.css";
import Controls from "../../components/Controls";
import Graph from "../../components/Graph";
import AlgoFetcher from "../../apis/AlgoFetcher";
import StepTracker from "../../components/StepTracker";
import { useSelector, useDispatch } from "react-redux";
import { updateAlgorSteps, resetSteps } from "../../redux/stateSlice";

const algorithmUrl = "pathfinding/dfs/";

const DepthFirstSearch = () => {
    const algorSteps = useSelector((state) => state.global.algorSteps);
    const currentStep = useSelector((state) => state.global.currentStep);
    const dispatch = useDispatch();

    var [currentTarget, setCurrentTarget] = useState(1);
    const [currentStart, setCurrentStart] = useState(0);

    // reset data upon exiting the page
    useEffect(() => {
        return () => {
            dispatch(resetSteps());
        };
    }, []);

    let this_graph = [
        [null, null, 3],
        [1, null, null],
        [2, 4, null]
    ];

    this_graph = [
        [null, 1, null, 1, null],
        [null, null, 1, null, 1],
        [1, null, null, null, null],
        [null, null, 1, null, 1],
        [1, null, null, null, null],
    ];

    const DoAlgorithm = async () => {
        let data = { graph: this_graph, start: actual_start, target: actual_target};
        try {
            let response = await AlgoFetcher.post(algorithmUrl, data);
            dispatch(updateAlgorSteps({ algorSteps: response.data.result }));
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Decide how to draw nodes in the graph.
     * Use by passing to the Graph.
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
     const drawDots = () => {
        // when page loaded at first or in case steps are missing
        let isStepAvailable =
            // the steps are loaded
            algorSteps.steps.length > 0 &&
            // if the algorithm is in progress (step 0: default state)
            currentStep > 0 &&
            // if the steps are in the correct format
            algorSteps.steps[0].highlight != null

        if (isStepAvailable) {
            var steps = algorSteps.steps;
            var currentArrayStep = currentStep - 1;
            var highlight = steps[currentArrayStep].highlight;
            var visited = steps[currentArrayStep].visited;
        }

        // for each element in the array at the current step
        return [...Array(this_graph.length).keys()].map((id) => {
            var style = "";
            if (isStepAvailable) {
                if (visited.includes(id)) {
                    style = " highlight-minflag";
                } else if (highlight.includes(id)) {
                    style = " highlight";
                } else if (highlight.length === 0) {
                    if (algorSteps.success && id === currentTarget) {
                        style = " highlight-success";
                    } else {
                        style = " highlight-error";
                    }
                } else {
                    style = " highlight-domain";
                }
            }

            return (
                <td className={"value-block dot" + style} key={id}> {id} </td>
            );
        });
    };

    // Make sure that the passed in values are legal
    var actual_start, actual_target;
    if (isNaN(currentStart)) actual_start = 0;
    else actual_start = currentStart;
    if (isNaN(currentTarget)) actual_target = 1;
    else actual_target = currentTarget;

    return (
        <div className="content">
            <div className="centered">
                <h2>Depth First Search</h2>
            </div>
            {/*
                <div className="info">
                    <button className="btn">Extra Info right here</button>
                </div>
                */}
            
            <Graph drawDots={drawDots} />

            <StepTracker />

            <div className="centered">Current start: {actual_start}</div>
            <div className="input-container">
                <input
                    className="num-input"
                    type="number"
                    placeholder="Search for"
                    value={currentStart}
                    onChange={(e) => {
                        setCurrentStart(parseInt(e.target.value));
                    }}
                ></input>
            </div>

            <div className="centered">Current target: {actual_target}</div>
            <div className="input-container">
                <input
                    className="num-input"
                    type="number"
                    placeholder="Search for"
                    value={currentTarget}
                    onChange={(e) => {
                        setCurrentTarget(parseInt(e.target.value));
                    }}
                ></input>
            </div>

            <Controls
                doAlgorithm={DoAlgorithm}
                numInput={() => {}}
            />
        </div>
    );
}

export default DepthFirstSearch;
