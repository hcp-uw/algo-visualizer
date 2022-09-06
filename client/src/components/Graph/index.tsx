/**
 * Handle the display of a graph.
 * props:
 *      - width? (Number): width of svg container
 *      - height? (Number): height of svg container
 */

import "./Graph.css";
import { randInt, copyObject } from "../../utilities/utilities";
import Draggable from "react-draggable";
import { SyntheticEvent, useState } from "react";

// default values for variables

// const EDGES = [
//     { n1: 0, n2: 1, weight: randInt(1, 100) },
//     { n1: 1, n2: 2, weight: randInt(1, 100) },
//     { n1: 1, n2: 3, weight: randInt(1, 100) },
// ];

// const NODES = [
//     {
//         init: { x: 60 + center.x, y: 50 + center.y },
//         x: 0,
//         y: 0,
//     },
//     {
//         init: { x: 150 + center.x, y: 90 + center.y },
//         x: 0,
//         y: 0,
//     },
//     {
//         init: { x: 340 + center.x, y: 90 + center.y },
//         x: 0,
//         y: 0,
//     },
//     {
//         init: { x: 50 + center.x, y: 240 + center.y },
//         x: 0,
//         y: 0,
//     },
// ];

const EDGES = [
    { n1: 0, n2: 1 },
    { n1: 0, n2: 2 },
    { n1: 1, n2: 3 },
    { n1: 1, n2: 4 },
    { n1: 4, n2: 5 },
    { n1: 2, n2: 6 },
];

const DEFAULT_WIDTH = 500;
const DEFAULT_HEIGHT = 500;
const NODE_RADIUS = 18;
const EDGE_WIDTH = 2;

type Coordinate = {
    x: number,
    y: number
}

type Node = {
    init: Coordinate,
    x: number,
    y: number
}

type Edge = {
    n1: number,
    n2: number,
    weight?: number
}

type WeightInputState = {
    show: boolean,
    x: number,
    y: number,
    target: number | null
}

// ----------------------------------------------

// helper functions independent of the component
const getEdgeTextStyle = (n1:Coordinate, n2:Coordinate):[string, { textAnchor: string}] => {
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
    ...props
}) => {
    const NODES = [
        {
            init: { x: 400 + center.x, y: 50 + center.y },
            x: 0,
            y: 0,
        },
        {
            init: { x: 300 + center.x, y: 100 + center.y },
            x: 0,
            y: 0,
        },
        {
            init: { x: 500 + center.x, y: 100 + center.y },
            x: 0,
            y: 0,
        },
        {
            init: { x: 250 + center.x, y: 150 + center.y },
            x: 0,
            y: 0,
        },
        {
            init: { x: 350 + center.x, y: 150 + center.y },
            x: 0,
            y: 0,
        },
        {
            init: { x: 400 + center.x, y: 200 + center.y },
            x: 0,
            y: 0,
        },
        {
            init: { x: 450 + center.x, y: 150 + center.y },
            x: 0,
            y: 0,
        },
    ];

    const [nodes, setNodes] = useState<Node[]>(NODES);
    const [edges, setEdges] = useState<Edge[]>(EDGES);
    const [activeNode, setActiveNode] = useState<number|null>(null);
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
    const [isDragging, setisDragging] = useState(false);

    const addNode = (initX:number, initY:number) => {
        let newNode:Node = { init: { x: initX, y: initY }, x: 0, y: 0 };
        setNodes([...nodes, newNode]);
    };

    const removeNode = (node:Node) => {
        // remove the node and any edges connected with it
        let copy = copyObject(nodes) as (Node|null)[];
        let edgesToRemove:number[] = [];

        // node at target index is set to null as a deletion
        // all other node indexes are kept the same
        let nodeIndex = nodes.indexOf(node);
        copy[nodeIndex] = null;
        for (let i = 0; i < edges.length; i++) {
            if (edges[i].n1 === nodeIndex || edges[i].n2 === nodeIndex) {
                edgesToRemove.push(i);
            }
        }

        setNodes(copy as Node[]);
        removeEdges(edgesToRemove);
    };

    /**
     * Remove edges.
     *
     * @param {Array} edgesToRemove array of edges (index) to remove
     */
    const removeEdges = (edgesToRemove:number[]) => {
        let copy:Edge[] = [];
        for (let i = 0; i < edges.length; i++) {
            if (!edgesToRemove.includes(i)) {
                copy.push(edges[i]);
            }
        }
        setEdges(copy);
    };

    /**
     *
     * @param {Number} n1 index of node 1
     * @param {Number} n2 index of node 2
     * @param {Number} weight
     */
    const addEdge = (n1:number, n2:number, weight:number) => {
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

    const modifyEdgeValue = (index:number, value:number) => {
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

    const calculateBound = (initPos:Coordinate) => {
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
                            let x1 = nodes[edge.n1].init.x + nodes[edge.n1].x;
                            let y1 = nodes[edge.n1].init.y + nodes[edge.n1].y;
                            let x2 = nodes[edge.n2].init.x + nodes[edge.n2].x;
                            let y2 = nodes[edge.n2].init.y + nodes[edge.n2].y;
                            let [dominantBaseline, style] = getEdgeTextStyle(
                                { x: x1, y: y1 },
                                { x: x2, y: y2 }
                            );

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
                                        stroke="#413939"
                                        strokeWidth={EDGE_WIDTH}
                                        key={"e " + index}
                                    />
                                    <text
                                        x={(x1 + x2) / 2}
                                        y={(y1 + y2) / 2}
                                        className="noselect"
                                        dominantBaseline={dominantBaseline}
                                        style={style as React.CSSProperties}
                                    >
                                        {edge.weight}
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
                                    nodes[activeNode].init.x +
                                    nodes[activeNode].x
                                }
                                y1={
                                    nodes[activeNode].init.y +
                                    nodes[activeNode].y
                                }
                                x2={cursorPos.x}
                                y2={cursorPos.y}
                                stroke="#413939"
                                strokeWidth="2"
                                key={"dynamic-edge"}
                            />
                        ) : null
                    }
                </g>
                <g className="nodes">
                    {nodes.map((node, index) => {
                        return node != null ? (
                            <Draggable
                                onDrag={(e, data) => {
                                    // this stop propergation prevent it from overlapping with the container's draggable
                                    // type any is a bandage
                                    (e as any).stopImmediatePropagation();
                                    e.stopPropagation();
                                    hideWeightInputBox();
                                    if (!isDragging) setisDragging(true);
                                    let copy = copyObject(nodes) as Node[];
                                    copy[index] = {
                                        ...nodes[index],
                                        x: data.x,
                                        y: data.y,
                                    };
                                    setNodes(copy);
                                }}
                                onStop={() => {
                                    // set draggin to false after 50ms
                                    // onStop is called before onClick so a delay is necessary
                                    setTimeout(() => {
                                        setisDragging(false);
                                    }, 50);
                                }}
                                key={"n" + index}
                                position={{
                                    x: nodes[index].x,
                                    y: nodes[index].y,
                                }}
                                // to make connecting nodes smoother
                                disabled={activeNode != null ? true : false}
                                bounds={calculateBound(node.init)}
                                scale={scale}
                            >
                                <g
                                    id={index.toString()}
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
                                                setActiveNode(index);
                                            } else {
                                                // add edge when connecting two nodes
                                                addEdge(
                                                    index,
                                                    activeNode,
                                                    randInt(1, 100)
                                                );
                                                setActiveNode(null);
                                            }
                                    }}
                                    onContextMenu={(e) => {
                                        removeNode(node);
                                    }}
                                >
                                    <circle
                                        cx={node.init.x}
                                        cy={node.init.y}
                                        r={NODE_RADIUS}
                                        className={
                                            index === activeNode
                                                ? "active-node"
                                                : ""
                                        }
                                    />
                                    <text
                                        x={node.init.x}
                                        y={node.init.y}
                                        textAnchor="middle"
                                        alignmentBaseline="middle"
                                        className="noselect"
                                        dy="0.1em"
                                    >
                                        {index}
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
