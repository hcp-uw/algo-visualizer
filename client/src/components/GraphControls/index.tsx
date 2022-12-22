import React, {useState, useEffect, useRef} from 'react';
import "./GraphControls.css";

import { randInt, copyObject } from "../../utilities/utilities";
import Draggable from "react-draggable";
import { Coordinate, Edge, Node, NodePositions } from "../../CommonTypes";
import { useDispatch, useSelector } from "react-redux";
import {
    resetGraphInput,
    updateGraphEdges,
    updateGraphNodes,
    updateGraphNodePositions,
    updateIsGraphInputChanged,
} from "../../redux/inputStateSlice";
import { RootState } from "../../redux/configureStore";
import { GraphAlgorithmResultType } from "../../AlgoResultTypes";

// default values for variables

const DEFAULT_WIDTH = 500;
const DEFAULT_HEIGHT = 500;
const NODE_RADIUS = 18;
const EDGE_WIDTH = 1;

type WeightInputState = {
    show: boolean;
    x: number;
    y: number;
    target: number | null;
};

// ----------------------------------------------

// helper functions independent of the component
const getEdgeTextStyle = (
    n1: Coordinate,
    n2: Coordinate
): [string, { textAnchor: string }] => {
    let first = undefined;
    let second = undefined;

    if (n1.x < n2.x) {
        first = n1;
        second = n2;
    } else {
        first = n2;
        second = n1;
    }

    let dominantBaseline =
        first.y > second.y ? "text-before-edge" : "text-after-edge";
    let style =
        first.x > second.x ? { textAnchor: "end" } : { textAnchor: "start" };

    return [dominantBaseline, style];
};
// ----------------------------------------------

// component
const GraphControls = ({
    center = { x: 0, y: 0 },
    containerWidth = DEFAULT_WIDTH,
    containerHeight = DEFAULT_HEIGHT,
    scale = 1,
    weighed = false,
    ...props
}) => {
    const dispatch = useDispatch();

    const nodes: string[] = useSelector((state: RootState) => state.input.graphNodes);
    const nodePositions: NodePositions = useSelector((state: RootState) => state.input.graphNodePositions);

    const setNodes = (nodes: string[], newNodePositions: NodePositions) => {
        dispatch(updateGraphNodes(nodes));
        dispatch(updateIsGraphInputChanged(true));
        dispatch(updateGraphNodePositions(newNodePositions));
    };

    const edges: Edge[] = useSelector((state: RootState) => state.input.graphEdges);

    const setEdges = (edges: Edge[]) => {
        dispatch(updateGraphEdges(edges));
        dispatch(updateIsGraphInputChanged(true));
    };

    const algorSteps = useSelector(
        (state: RootState) => state.global.algorSteps
    ) as GraphAlgorithmResultType;
    const currentStep = useSelector(
        (state: RootState) => state.global.currentStep
    );

    const [activeNode, setActiveNode] = useState<string | null>(null);
    const [cursorPos, setCursorPos] = useState<Coordinate>({ x: 0, y: 0 }); // relative to svg element
    const [weightInputState, setWeightInputState] = useState<WeightInputState>({
        show: false,
        x: 0,
        y: 0,
        target: null,
    });
    // when drag stop, an onclick event follows
    // and it messes up with the click to connect function
    // keeping a dragging flag to distinguish the normal click
    // and the click after a drag
    const [nodeCount, setNodeCount] = useState(
        Object.keys(nodePositions).length
    );
    const [isDragging, setisDragging] = useState(false);

    const addNode = (initX: number, initY: number) => {
        let newPosition: Node = {
            init: { x: initX, y: initY },
            x: 0,
            y: 0,
        };
        //let id = nodeCount.toString();
        let element = document.getElementById("addNode") as HTMLInputElement;
        let value = element.value;
        let integerValue = Number.parseInt(value);
        // here we will check if a value has been inputted in
        if (value === "") {
          window.alert("Please input a value for the node!");
        } else {
          // here we will check if there is an integer given
          if (!Number.isNaN(integerValue)) {
            console.log(nodes);
            // here we want to check that the value we are inputting
            // has not yet been in the graph
            // this is because our map needs to have unique values
            if (!nodes.includes(String(integerValue))) {
              let newNodeList = copyObject(nodes) as string[];
              newNodeList.push(value);
              let newNodePositions = copyObject(nodePositions) as NodePositions;
              newNodePositions[value] = newPosition;

              setNodes(newNodeList, newNodePositions);
              setNodeCount((prev) => prev + 1);
            } else {
              window.alert("Value already taken!");
            }

          } else {
            window.alert("Please give an integer input!");
          }
        }
        element.value = "";
    };

    const removeNode = (nodeId: string) => {
        // remove the node and any edges connected with it
        let newNodePositions = copyObject(nodePositions) as NodePositions;
        let newNodeList = copyObject(nodes) as string[];
        let edgesToRemove: number[] = [];

        // deletion removes the node id from map
        for (let i = 0; i < edges.length; i++) {
            if (edges[i].n1 === nodeId || edges[i].n2 === nodeId) {
                edgesToRemove.push(i);
            }
        }

        // remove from copy
        delete newNodePositions[nodeId];
        newNodeList.splice(newNodeList.indexOf(nodeId), 1);

        // update
        setNodes(newNodeList, newNodePositions);
        removeEdges(edgesToRemove);
    };

    /**
     *
     * @param {string} n1 id of node 1
     * @param {string} n2 id of node 2
     * @param {string} weight
     */
    const addEdge = (n1: string, n2: string, weight: number | undefined) => {
      // check if trying to add edge to the same node
      if (n1 === n2) return;
      // check if edge already exist
      for (const edge of edges) {
          if (
              (edge.n1 === n1 || edge.n2 === n1) &&
              (edge.n1 === n2 || edge.n2 === n2)
          )
              return;
      }
      setEdges([...edges, { n1, n2, weight }]);
  };

    /**
     * Remove edges.
     *
     * @param {Array} edgesToRemove array of edges (index) to remove
     */
    const removeEdges = (edgesToRemove: number[]) => {
        let copy: Edge[] = [];
        for (let i = 0; i < edges.length; i++) {
            if (!edgesToRemove.includes(i)) {
                copy.push(edges[i]);
            }
        }
        setEdges(copy);
    };

    const modifyEdgeValue = (index: number, value: number) => {
        let copy = copyObject(edges) as Edge[];
        copy[index].weight = value;
        setEdges(copy);
    };

    const hideWeightInputBox = () => {
        if (weightInputState.show)
            setWeightInputState({
                show: false,
                x: 0,
                y: 0,
                target: null,
            });
    };

    const calculateBound = (initPos: Coordinate) => {
        // bounds in format of Draggable object
        const width = containerWidth;
        const height = containerHeight;
        const pad = NODE_RADIUS + 3; // depends on node radius
        return {
            top: 0 - initPos.y + pad,
            left: 0 - initPos.x + pad,
            bottom: height - initPos.y - pad,
            right: width - initPos.x - pad,
        };
    };

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
    <>
      <div id="body">
        <div className="dfs-graph-controls">
          <input id="addNode" type="text"></input>
          <button className = "buttonClass"
          onClick={() => {
            addNode(700, 225);
          }}
          >
            Add Node
          </button>
        </div>
        <div className="dfs-graph-controls">
          <select>
          </select>
          <button className = "buttonClass">
            Remove Node
          </button>
        </div>
        <div className="dfs-graph-controls">
          <select className="select_two">
          </select>
          <select className="select_two">
          </select>
          <button className = "buttonClass">
            Add Edge
          </button>
        </div>
        <div className="dfs-graph-controls">
          <select className="select_two">
          </select>
          <select className="select_two">
          </select>
          <button className = "buttonClass">
            Remove Edge
          </button>
        </div>
      </div>
    </>
  )
}

export default GraphControls;