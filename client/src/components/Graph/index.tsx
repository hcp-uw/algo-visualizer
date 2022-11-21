/**
 * Handle the display of a graph.
 * props:
 *      - width? (Number): width of svg container
 *      - height? (Number): height of svg container
 */

import "./Graph.css";
import { randInt, copyObject } from "../../utilities/utilities";
import Draggable from "react-draggable";
import { useEffect, useState } from "react";
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
const Graph = ({
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
        let id = nodeCount.toString();
        let newNodeList = copyObject(nodes) as string[];
        newNodeList.push(id);
        let newNodePositions = copyObject(nodePositions) as NodePositions;
        newNodePositions[id] = newPosition;

        setNodes(newNodeList, newNodePositions);
        setNodeCount((prev) => prev + 1);
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

    /*
    useEffect(() => {
        return () => {
            // reset inputs on component unmount
            dispatch(resetGraphInput());
        };
    }, []);
    */

    return (
        // this outter div act as an anchor for any absolute positioned elements
        <div style={{ position: "relative" }}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox={`0 0 ${containerWidth} ${containerHeight}`}
                width={containerWidth}
                height={containerHeight}
                style={{ overflow: "inherit" }}
                onDoubleClick={(e) => {
                    addNode(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                }}
                onClick={(e) => {
                    hideWeightInputBox();
                }}
                onContextMenu={(e) => {
                    e.preventDefault();
                    hideWeightInputBox();
                    setActiveNode(null);
                }}
                onMouseMove={(e) => {
                    // could cause performance issue
                    if (activeNode != null)
                        setCursorPos({
                            x: e.nativeEvent.offsetX,
                            y: e.nativeEvent.offsetY,
                        });
                }}
                className="graph-canvas"
            >
                <g className="edges">
                    {edges.map((edge, index) => {
                        try {
                            let x1 =
                                nodePositions[edge.n1].init.x +
                                nodePositions[edge.n1].x;
                            let y1 =
                                nodePositions[edge.n1].init.y +
                                nodePositions[edge.n1].y;
                            let x2 =
                                nodePositions[edge.n2].init.x +
                                nodePositions[edge.n2].x;
                            let y2 =
                                nodePositions[edge.n2].init.y +
                                nodePositions[edge.n2].y;
                            let [dominantBaseline, style] = getEdgeTextStyle(
                                { x: x1, y: y1 },
                                { x: x2, y: y2 }
                            );

                            let extraStyle = edgeHighlightStyle(edge);
                            let rev = extraStyle.includes("reverse");

                            return (
                                <g
                                    onDoubleClick={(e) => {
                                        // show weight input box
                                        setWeightInputState({
                                            show: true,
                                            x: e.nativeEvent.offsetX,
                                            y: e.nativeEvent.offsetY,
                                            target: index,
                                        });
                                        e.stopPropagation();
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        hideWeightInputBox();
                                    }}
                                    onContextMenu={(e) => {
                                        removeEdges([index]);
                                    }}
                                    key={"e" + index}
                                >
                                    <line
                                        x1={x1}
                                        y1={y1}
                                        x2={x2}
                                        y2={y2}
                                        //lassName={edgeHighlightStyle(edge)}
                                        strokeWidth={EDGE_WIDTH}
                                        key={"e " + index}
                                    />
                                    {/* extra line on top of the original for line animation */}
                                    {extraStyle.includes("edge-highlighted") ? (
                                        <line
                                            x1={rev ? x2 : x1}
                                            y1={rev ? y2 : y1}
                                            x2={rev ? x1 : x2}
                                            y2={rev ? y1 : y2}
                                            className={edgeHighlightStyle(edge)}
                                            strokeWidth={EDGE_WIDTH + 1}
                                            key={"e " + index + "h"}
                                        />
                                    ) : null}
                                    <text
                                        x={(x1 + x2) / 2}
                                        y={(y1 + y2) / 2}
                                        className="noselect"
                                        dominantBaseline={dominantBaseline}
                                        style={style as React.CSSProperties}
                                    >
                                        {edge.weight || ""}
                                    </text>
                                </g>
                            );
                        } catch (e) {
                            console.log(e);
                        }
                        return null;
                    })}
                    {
                        //extra line
                        activeNode != null ? (
                            <line
                                x1={
                                    nodePositions[activeNode].init.x +
                                    nodePositions[activeNode].x
                                }
                                y1={
                                    nodePositions[activeNode].init.y +
                                    nodePositions[activeNode].y
                                }
                                x2={cursorPos.x}
                                y2={cursorPos.y}
                                stroke="#413939"
                                strokeWidth="2"
                                key={"dynamic-edge"}
                                className="no-anim"
                            />
                        ) : null
                    }
                </g>
                <g className="nodes">
                    {nodes.map((nodeId) => {
                        console.log(nodeId);
                        return nodeId != null ? (
                            <Draggable
                                onDrag={(e, data) => {
                                    // this stop propergation prevent it from overlapping with the container's draggable
                                    // type any is a bandage
                                    (e as any).stopImmediatePropagation();
                                    e.stopPropagation();
                                    hideWeightInputBox();
                                    if (!isDragging) setisDragging(true);

                                    let newNodePositions = copyObject(
                                        nodePositions
                                    ) as NodePositions;
                                    newNodePositions[nodeId] = {
                                        ...newNodePositions[nodeId],
                                        x: data.x,
                                        y: data.y,
                                    };
                                    dispatch(updateGraphNodePositions(newNodePositions));
                                }}
                                onStop={() => {
                                    // set draggin to false after 50ms
                                    // onStop is called before onClick so a delay is necessary
                                    setTimeout(() => {
                                        setisDragging(false);
                                    }, 50);
                                }}
                                key={"n" + nodeId}
                                position={{
                                    x: nodePositions[nodeId].x,
                                    y: nodePositions[nodeId].y,
                                }}
                                // to make connecting nodes smoother
                                disabled={activeNode != null ? true : false}
                                bounds={calculateBound(
                                    nodePositions[nodeId].init
                                )}
                                scale={scale}
                            >
                                <g
                                    id={nodeId}
                                    fill="#A020F0"
                                    className="node"
                                    onDoubleClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        hideWeightInputBox();
                                        if (!isDragging)
                                            if (activeNode === null) {
                                                setActiveNode(nodeId);
                                                setCursorPos({
                                                    x: e.nativeEvent.offsetX,
                                                    y: e.nativeEvent.offsetY,
                                                });
                                            } else {
                                                // add edge when connecting two nodes
                                                addEdge(
                                                    nodeId,
                                                    activeNode,
                                                    weighed
                                                        ? randInt(1, 100)
                                                        : undefined
                                                );
                                                setActiveNode(null);
                                            }
                                    }}
                                    onContextMenu={(e) => {
                                        removeNode(nodeId);
                                    }}
                                >
                                    <circle
                                        cx={nodePositions[nodeId].init.x}
                                        cy={nodePositions[nodeId].init.y}
                                        r={NODE_RADIUS}
                                        className={
                                            nodeId === activeNode
                                                ? "node-active"
                                                : "" +
                                                nodeHighlightStyle(nodeId)
                                        }
                                    />
                                    <text
                                        x={nodePositions[nodeId].init.x}
                                        y={nodePositions[nodeId].init.y}
                                        textAnchor="middle"
                                        alignmentBaseline="middle"
                                        className="noselect"
                                        dy="0.1em"
                                    >
                                        {nodeId}
                                    </text>
                                </g>
                            </Draggable>
                        ) : null;
                    })}
                </g>
            </svg>
            {weightInputState.show ? (
                <input
                    type="number"
                    className="weight-input"
                    value={
                        weightInputState.target != null
                            ? edges[weightInputState.target].weight
                            : ""
                    }
                    style={{
                        left: `${weightInputState.x - 24}px`,
                        top: `${weightInputState.y - 12}px`,
                    }}
                    onChange={(e) => {
                        if (
                            weightInputState.target != null &&
                            // limit input length
                            e.target.value.length < 5
                        ) {
                            modifyEdgeValue(
                                weightInputState.target,
                                parseInt(e.target.value)
                            );
                        }
                    }}
                    // disable dragging on input box
                    onMouseDown={(e) => {
                        e.stopPropagation();
                    }}
                    autoFocus
                />
            ) : null}
        </div>
    );
};

export default Graph;
