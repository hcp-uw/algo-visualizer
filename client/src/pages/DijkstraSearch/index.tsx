import React, { useRef, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./DijkstraSearch.css";
import Controls from "../../components/Controls";
import StepTracker from "../../components/StepTracker";
import Graph from "../../components/Graph";
import VisualizerContainer from "../../components/VisualizerContainer";
import { useSelector, useDispatch } from "react-redux";
import AlgorithmPopover from "../../components/AlgorithmPopover";
import { resetSteps, updateAlgorName } from "../../redux/stateSlice";
import { dijkstrasFirstSearchDesc } from "../../assets/algorithm-information.js";
import PriorityQueue from "../../components/PriorityQueue";
import { RootState } from "../../redux/configureStore";
import { GraphAlgorithmResultType } from "../../AlgoResultTypes";
import { Edge } from "../../CommonTypes";
import GraphControls from "../../components/GraphControls";
import { resetWeightedGraphInput } from "../../redux/inputStateSlice";

const ALGORITHM_URL = "searches/DijkstraSearch/";

const DijkstraSearch = () => {

    const dispatch = useDispatch();
    const innerGraphBoxWidth = 1400;
    const innerGraphBoxHeight = 450;

    const algorSteps = useSelector(
        (state: RootState) => state.global.algorSteps
    ) as GraphAlgorithmResultType;
    const currentStep = useSelector(
        (state: RootState) => state.global.currentStep
    );


    // reset data upon exiting the page
    useEffect(() => {
        // update the name on first load
        dispatch(updateAlgorName(dijkstrasFirstSearchDesc.algorithm));
        dispatch(resetWeightedGraphInput())

        return () => {
            dispatch(resetSteps());
        };
    }, []);

    const nodeHighlightStyle = (id: string) => {
        let style = " ";
        if (currentStep < 1 || algorSteps.steps.length === 0) return style;

        if (algorSteps.steps[currentStep - 1].currentNode.includes(id)) {
            style += "node-active ";
        } else if (
            algorSteps.steps[currentStep - 1].visitedNodes.includes(id)
        ) {
            style += "node-highlighted ";
        }
        return style;
    };

    const edgeHighlightStyle = (edge: Edge) => {
        let style = " ";
        if (currentStep < 1 || algorSteps.steps.length === 0) return style;

        let currentEdgeList = algorSteps.steps[currentStep - 1].visitedEdges;
        for (const edg of currentEdgeList) {
            if (`${edge.n1} ${edge.n2}` === `${edg.n1} ${edg.n2}`) {
                style += "edge-highlighted ";
                break;
            } else if (`${edge.n1} ${edge.n2}` === `${edg.n2} ${edg.n1}`) {
                style += "edge-highlighted-reverse ";
                break;
            }
        }
        return style;
    };

    return (
        <div className="content">
            <div className="centered">
                <AlgorithmPopover data={dijkstrasFirstSearchDesc} />
            </div>

            <VisualizerContainer
                height="400"
                staticChildren={<PriorityQueue />}
                minScale={0.3}
                scale={0.8}
                initPosition={{ x: -150, y: -25 }}
            >
                <Graph
                    containerWidth={innerGraphBoxWidth}
                    containerHeight={innerGraphBoxHeight}
                    edgeHighlightStyle={edgeHighlightStyle}
                    nodeHighlightStyle={nodeHighlightStyle}
                />
            </VisualizerContainer>

            <div className="dfs-graph-controls">
                <div id="controlsDiv" className="controls_graph">
                    <Controls algorithmUrl={ALGORITHM_URL} require={["graphInput"]} edgeWeight={true} />
                </div>
                <div id="GraphControlsDiv">
                    <GraphControls/>
                </div>
            </div>
            <StepTracker />
        </div>
    );
};

export default DijkstraSearch;