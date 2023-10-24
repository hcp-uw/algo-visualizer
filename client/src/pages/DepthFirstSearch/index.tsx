import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./DepthFirstSearch.css";
import Controls from "../../components/Controls";
import GraphControls from "../../components/GraphControls";
import StepTracker from "../../components/StepTracker";
import Graph from "../../components/Graph";
import VisualizerContainer from "../../components/VisualizerContainer";
import { useDispatch, useSelector } from "react-redux";
import AlgorithmPopover from "../../components/AlgorithmPopover";
import { resetSteps, updateAlgorName } from "../../redux/stateSlice";
import { depthFirstSearchDesc } from "../../assets/algorithm-information.js";
import Stack from "../../components/Stack";
import { RootState } from "../../redux/configureStore";
import { GraphAlgorithmResultType } from "../../AlgoResultTypes";
import { Edge } from "../../CommonTypes";
import { resetGraphInput, resetWeightedGraphInput } from "../../redux/inputStateSlice";

const ALGORITHM_URL = "searches/depthfirstsearch/";

const DepthFirstSearch = () => {
  const dispatch = useDispatch();
  const innerGraphBoxWidth = 1400;
  const innerGraphBoxHeight = 450;

  const algorSteps = useSelector(
    (state: RootState) => state.global.algorSteps,
  ) as GraphAlgorithmResultType;
  const currentStep = useSelector(
    (state: RootState) => state.global.currentStep,
  );

  // reset data upon exiting the page
  useEffect(() => {
    // update the name on first load
    dispatch(updateAlgorName(depthFirstSearchDesc.algorithm));
    dispatch(resetGraphInput());
    dispatch(resetSteps())

    return () => {
      console.log('>>>>>');
      dispatch(resetGraphInput());
      dispatch(resetSteps());
      dispatch(resetWeightedGraphInput())
    };
  }, []);

  const nodeHighlightStyle = (id: string) => {
    let style = " ";
    if (currentStep < 1 || algorSteps.steps.length === 0) return style;

    if (algorSteps.steps[currentStep - 1].currentNode.includes(id)) {
      style += "node-active ";
    } else if (algorSteps.steps[currentStep - 1].visitedNodes.includes(id)) {
      style += "node-highlighted ";
    }

    if (id === algorSteps.startNode) {
      style += "node-start ";
    } else if (id === algorSteps.targetNode) {
      if (algorSteps.steps[currentStep - 1].visitedNodes.includes(id)) {
        style += "node-target-found "
      } else {
        style += "node-target-unfound";
      }
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
        <AlgorithmPopover data={depthFirstSearchDesc} />
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div id="GraphControlsContainer">
          <GraphControls />
        </div>
        <VisualizerContainer
          height="400"
          staticChildren={<Stack />}
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
      </div>
      <div className="centered">
        <Controls algorithmUrl={ALGORITHM_URL} require={["graphInput"]} />
      </div>
      <StepTracker />
    </div>
  );
};

export default DepthFirstSearch;
