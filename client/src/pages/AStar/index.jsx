import React, { useRef, useState, useEffect } from "react";
import { ButtonGroup, Container, ToggleButton } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "./AStar.css";
import Controls from "../../components/Controls";
import Graph from "../../components/Graph";
import AlgoFetcher from "../../apis/AlgoFetcher";
import StepTracker from "../../components/StepTracker";
import { animated, Transition } from "react-spring";
import { useSelector, useDispatch } from "react-redux";
import { updateAlgorSteps, resetSteps } from "../../redux/stateSlice";
import { updateGraph, updateStep } from "../../redux/stateSlice";

const algorithmUrl = "pathfinding/astar/";

const AStar = () => {
    const algorSteps = useSelector((state) => state.global.algorSteps);
    const currentStep = useSelector((state) => state.global.currentStep);
    const prevStep = useSelector((state) => state.global.prevStep);
    const dispatch = useDispatch();
    const [selection, setSelection] = useState("1");

    // reset data upon exiting the page
    useEffect(() => {
        return () => {
            dispatch(resetSteps());
        };
    }, []);

    let rows = 5;
    let columns = 13;
    let initial_graph = [];
    for (var i = 0; i < rows; i++) {
        initial_graph.push(Array(columns).fill(0));
    }
    let initial_start = {row: 0, col: 0};
    let initial_target = {row: (rows - 1), col: (columns - 1)};
    const [graph, setGraph] = useState(initial_graph);
    const [start, setStart] = useState(initial_start);
    const [target, setTarget] = useState(initial_target);

    const DoAlgorithm = async () => {
        let data = { graph: graph, start: start, target: target };
        try {
            let response = await AlgoFetcher.post(algorithmUrl, data);
            dispatch(updateAlgorSteps({ algorSteps: response.data.result }));
        } catch (err) {
            console.log(err);
        }
    }

    const switchBlockType = (key) => {
        let temp_graph = graph.slice();
        let row = Math.floor(key / temp_graph[0].length);
        let col = key % temp_graph[0].length;
        if (selection == 3) {
            if (temp_graph[row][col] === 10) {
                temp_graph[row][col] = null;
                setGraph(temp_graph);
            } else if (temp_graph[row][col] === 0) {
                temp_graph[row][col] = 10;
                setGraph(temp_graph);
            } else {
                temp_graph[row][col] = 0;
                setGraph(temp_graph);
            }
        } else if (selection == 2) {
            setTarget({row: row, col: col});
        } else {
            setStart({row: row, col: col});
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
     const drawBlocks = () => {
        // when page loaded at first or in case steps are missing
        let isStepAvailable =
            // the steps are loaded
            algorSteps.steps.length > 0 &&
            // if the algorithm is in progress (step 0: default state)
            currentStep > 0 &&
            // if the steps are in the correct format
            algorSteps.steps[0].visited != null

        if (isStepAvailable) {
            var steps = algorSteps.steps;
            var currentArrayStep = currentStep - 1;
            var highlight = steps[currentArrayStep].highlight;
            var visited = steps[currentArrayStep].visited;
            var path = steps[currentArrayStep].path;
            var costs = steps[currentArrayStep].costs;
            var curr = steps[currentArrayStep].curr;
        }

        // for each element in the array at the current step
        return [...Array(graph.length).keys()].map((row) => {
            return (
                <tr key={row}>
                    {[...Array(graph[0].length).keys()].map((col) => {
                        var style = "";
                        var key = row * graph[0].length + col;
                        if (isStepAvailable) {
                            if (graph[row][col] === null) {
                                style = " highlight-black";
                            } else if (curr === key) {
                                style = " highlight-success";
                            } else if (path.includes(key)) {
                                style = " highlight-minflag";
                            } else if (graph[row][col] === 10) {
                                style = " highlight-gray";
                            } else if (visited.includes(key)) {
                                style = " highlight";
                            } else if (highlight.includes(key)) {
                                style = " highlight-error";
                            } else if (highlight.length === 0) {
                                if (algorSteps.success && key === target) {
                                    style = " highlight-success";
                                } else {
                                    // initialStyle = " highlight-error";
                                }
                            } else {
                                // initialStyle = " highlight-domain";
                            }
                        }

                        var name;
                        if (costs) {
                            name = costs[key];
                        } else name = " ";
                        // style = initialStyle;

                        return (
                            <td
                                key={key} className={"value-block" + style}
                                onClick={() => switchBlockType(key)}
                            >
                                {name}
                            </td>
                        );
                    })}
                </tr>
            );
        });
    };

    const buttons = [
        { name: "Move Start", value: "1" },
        { name: "Move Target", value: "2" },
        { name: "Toggle Weight", value: "3" },
    ];

    return (
        <div className="content">
            <div className="centered">
                <h2>A*</h2>
            </div>
            {/*
                <div className="info">
                    <button className="btn">Extra Info right here</button>
                </div>
                */}
            
            <Graph drawDots={drawBlocks} />

            <StepTracker />
            <Container fluid className="centered">
                <ButtonGroup>
                    {buttons.map((item, idx) => (
                    <ToggleButton
                        key={idx}
                        variant={'outline-secondary'}
                        value={item.value}
                        id={`radio-${idx}`}
                        type="radio"
                        name="radio"
                        checked={selection === item.value}
                        onChange={(e) => setSelection(e.currentTarget.value)}
                    >
                        {item.name}
                    </ToggleButton>
                    ))}
                </ButtonGroup>
            </Container>

            <Controls
                doAlgorithm={DoAlgorithm}
                numInput={() => {}}
            />
        </div>
    );
}

export default AStar;
