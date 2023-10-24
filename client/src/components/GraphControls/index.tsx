import React, { useEffect, useState } from "react";
import "./GraphControls.css";
import FruchSpring from "./LayoutAlgorithm";

import { Coordinate, Edge, Node, NodePositions } from "../../CommonTypes";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  updateGraphEdges,
  updateGraphNodePositions,
  updateGraphNodes,
  updateIsGraphInputChanged,
  updateGraphStartNode,
  updateGraphTargetNode,
} from "../../redux/inputStateSlice";
import { RootState } from "../../redux/configureStore";
import { GraphAlgorithmResultType } from "../../AlgoResultTypes";
import { toast } from "react-toastify";

// default values for variables

const DEFAULT_WIDTH = 500;
const DEFAULT_HEIGHT = 500;
const NODE_RADIUS = 18;

// error messages for input parsing
const MAX_INPUT_LENGTH = 3;
const ARGUMENT_LENGTH_ERROR = "Invalid number of arguments";
const EDGE_WEIGHT_ERROR = "Edge weight must be a number.";
const NO_PARSING_ERROR = "";

// number of iterations to run the graph layout algorithm for
const NUM_LAYOUT_ITERATIONS = 500;

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

  // TODO: move these into a constants file
  const innerGraphBoxWidth = 1000;
  const innerGraphBoxHeight = 450;

  const nodes: string[] = useSelector(
    (state: RootState) => state.input.graphNodes,
  );

  const setNodes = (nodes: string[], newNodePositions: NodePositions) => {
    dispatch(updateGraphNodes(nodes));
    dispatch(updateIsGraphInputChanged(true));
    dispatch(updateGraphNodePositions(newNodePositions));
  };

  const edges: Edge[] = useSelector(
    (state: RootState) => state.input.graphEdges,
  );

  useEffect(() => {
    // redraw lines in text box
    // a - b
    // c
    generateLines();
  }, [nodes, edges]);

  const setEdges = (edges: Edge[]) => {
    dispatch(updateGraphEdges(edges));
    dispatch(updateIsGraphInputChanged(true));
  };

  const startNode = useSelector((state: RootState) => state.input.startNode, shallowEqual);
  const targetNode = useSelector((state: RootState) => state.input.targetNode, shallowEqual);

  const setGraphStartNode = (start: string) => {
    // @todo: validation
    if (start !== '' && !nodes.includes(start)) {
      // @node: right now this requires user to click 'build graph' first,
      // which isn't super obvious
      toast.error('Start node must be in graph', {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;

    }
    dispatch(updateGraphStartNode(start));
    dispatch(updateIsGraphInputChanged(true));
  }

  useEffect(() => {
    console.log(`target node is ${targetNode}`)

  }, [targetNode])


  const [targetNodeState, setTargetNodeState] = useState<string>("");
  const setGraphTargetNode = (target: string) => {
    // @todo: validation
    dispatch(updateGraphTargetNode(target));
    dispatch(updateIsGraphInputChanged(true));
  }

  const [textInput, setTextInput] = useState<string>("");

  const generateNodeLine = (node: string): string => {
    return node + "\n";
  };

  const generateEdgeLine = (edge: Edge): string => {
    let line = edge.n1 + " " + edge.n2;
    if (edge.weight !== undefined) {
      line += " " + edge.weight;
    }
    line += "\n";
    return line;
  };

  // Updates text area with current node data
  const generateLines = () => {
    let nodeSet = new Set<string>(nodes);

    let lines = "";
    // filter out duplicates
    edges.forEach((edge) => {
      if (nodeSet.has(edge.n1)) nodeSet.delete(edge.n1);
      if (nodeSet.has(edge.n2)) nodeSet.delete(edge.n2);

      lines += generateEdgeLine(edge);
    });

    nodeSet.forEach((node) => {
      lines += generateNodeLine(node);
    });
    setTextInput(lines);
  };

  // Check that given line's input is correctly formatted.
  // If so, parses out nodes and possibly an edge from the line and adds
  // them to nodeSet and edgeSet
  const processInputLine = (
    text: String,
    nodeSet: Set<string>,
    edgeSet: Set<Edge>,
  ): string => {
    text = text.trim();
    if (text === "") {
      // Skip empty line
      return NO_PARSING_ERROR;
    }

    let words = text.split(" ");

    if (words.length > MAX_INPUT_LENGTH) {
      return ARGUMENT_LENGTH_ERROR;
    }
    if (words.length === 1) {
      // just a node
      nodeSet.add(words[0]);
    }
    if (words.length === 2) {
      // two nodes with an unweighted edge
      nodeSet.add(words[0]);
      nodeSet.add(words[1]);
      let e: Edge = {
        n1: words[0],
        n2: words[1],
      };
      edgeSet.add(e);
    } else if (words.length === 3) {
      // two nodes with weighted edge
      if (isNaN(parseFloat(words[2]))) {
        return EDGE_WEIGHT_ERROR;
      }

      nodeSet.add(words[0]);
      nodeSet.add(words[1]);

      let e: Edge = {
        n1: words[0],
        n2: words[1],
        weight: Number(words[2]),
      };
      edgeSet.add(e);
    }
    return NO_PARSING_ERROR;
  };

  const getRandomNodePositions = (baseNodes: string[]): NodePositions => {
    let positions: NodePositions = {};
    baseNodes.forEach((node) => {
      let xCoord =
        Math.floor(Math.random() * (innerGraphBoxWidth - NODE_RADIUS * 2)) +
        NODE_RADIUS;
      let yCoord =
        Math.floor(Math.random() * (innerGraphBoxHeight - NODE_RADIUS * 2)) +
        NODE_RADIUS;
      positions[node] = { init: { x: xCoord, y: yCoord }, x: 0, y: 0 };
    });
    return positions;
  };

  const buildGraphMap = ({
    parsedEdges,
    positions,
  }: {
    parsedEdges: Edge[];
    positions: NodePositions;
  }): Map<Node, Array<Node>> => {
    let g = new Map<Node, Array<Node>>();
    for (let edge of parsedEdges) {
      let children = g.get(positions[edge.n1]);
      if (!children) children = new Array<Node>();
      children.push(positions[edge.n2]);
      g.set(positions[edge.n1], children);

      let children2 = g.get(positions[edge.n2]);
      if (!children2) children2 = new Array<Node>();
      children2.push(positions[edge.n1]);
      g.set(positions[edge.n2], children2);
    }
    return g;
  };

  const computeNewGraphLayout = ({
    parsedEdges,
    parsedNodes,
  }: {
    parsedEdges: Edge[];
    parsedNodes: string[];
  }) => {
    // valid result
    setEdges(parsedEdges);
    let positions = getRandomNodePositions(parsedNodes);
    const g = buildGraphMap({ parsedEdges, positions });

    let fr = new FruchSpring(3.0, 1, DEFAULT_WIDTH / 2, DEFAULT_HEIGHT / 2);

    // parse nodes into position
    let nn: any = [];

    for (let key of Object.keys(positions)) {
      nn.push(positions[key]);
    }

    for (let i = 0; i < NUM_LAYOUT_ITERATIONS; i++) {
      fr.updateNodes(nn, g);
    }

    setNodes(parsedNodes, positions);
  };

  const parseInputToGraph = () => {
    const linesOfText = textInput.split("\n");
    let nodeSet = new Set<string>();
    let edgeSet = new Set<Edge>();

    let errorResult = NO_PARSING_ERROR;
    let lineNumber = 0;

    // Check if each line is valid
    for (lineNumber = 0; lineNumber < linesOfText.length; lineNumber++) {
      let line = linesOfText[lineNumber];
      errorResult = processInputLine(line, nodeSet, edgeSet);
      if (errorResult !== NO_PARSING_ERROR) {
        break;
      }
    }

    let parsedNodes = Array.from(nodeSet);
    let parsedEdges = Array.from(edgeSet);

    if (errorResult === NO_PARSING_ERROR) {
      computeNewGraphLayout({ parsedNodes, parsedEdges });

      toast.success("parsed graph input!!", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      toast.error(errorResult, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <>
      <div id="body" className="graph-controls-container">
        <textarea
          name="body"
          className="graph-input"
          onChange={(e) => setTextInput(e.target.value)}
          value={textInput}
        />
        <button
          className="buttonClass"
          onClick={() => {
            parseInputToGraph();
          }}
        >
          build graph.
        </button>


        {/*  @todo: dropdowns to select a node (maybe) */}
        <input
          className="graph-search-input"
          onChange={(e) => setGraphStartNode(e.target.value)}
          placeholder="Start node"
          value={startNode}
        />
        <input
          className="graph-search-input"
          onChange={(e) => setGraphTargetNode(e.target.value)}
          placeholder="Target node"
          value={targetNode}
        />
      </div>
    </>
  );
};

export default GraphControls;
