/**
 * Wrap this component around any visual components to make it draggable and zoomable.
 */

import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./VisualizerContainer.css";
import Draggable from "react-draggable";
import { Coordinate, Edge, Node, NodePositions } from "../../CommonTypes";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/configureStore";


const MAX_SCALE_LIMIT = 1.5;
const MIN_SCALE_LIMIT = 0.5;
const SCALE_INCREMENT = 0.1;

const VisualizerContainer = ({ ...props }) => {
    let s = props.scale || 1;

    let initPosition = props.initPosition || { x: 0, y: 0 };

    let graph = props?.isGraph;

    const nodePositions: NodePositions = useSelector((state: RootState) => state.input.graphNodePositions);
    console.log(nodePositions);

    // It'll either be 0.5 at the least, 1.5 at the most, and s if it's right in between.
    const [scale, setScale] = useState(Math.min(MAX_SCALE_LIMIT, Math.max(MIN_SCALE_LIMIT, s)));

    // these two states are for position reset
    const [position, setPosition] = useState(initPosition);
    const [key, setKey] = useState(1);
    const [lock, setLock] = useState(false);

    // call back for position reset
    // when to reset the position of a Draggable, we set its position props
    // to {x:0, y:0}, then set it back to null so it's automatically controlled again
    // by the library. This only works if the Draggable component is remounted,
    // by giving the Draggable component a different 'key'
    useEffect(() => {
        if (position != null) {
            setPosition(null);
        }
    }, [position]);

    // to get rid of deprecated warning of Draggable library
    // https://stackoverflow.com/questions/63603902/finddomnode-is-deprecated-in-strictmode-finddomnode-was-passed-an-instance-of-d
    const nodeRef = useRef(null);

    // applying scale on Draggable element: https://github.com/react-grid-layout/react-draggable/issues/353#issuecomment-581096184
    const style = {
        transform: `scale(${scale})`,
        // transition smooth the scaling
        transition: "transform 0.1s ease-in-out",
    };

    // handle scale change on mouse wheel scroll
    // 1 for increasing scale and -1 for decreasing
    const handleScaleChange = (delta: 1 | -1) => {
        if (!lock) {
            let d = 0;
            if (delta > 0) {
                // increase scale
                d = Math.min(MAX_SCALE_LIMIT, scale + SCALE_INCREMENT);
            } else {
                // decrease scale
                d = Math.max(MIN_SCALE_LIMIT, scale - SCALE_INCREMENT);
            }
            setScale(d);
        }
    };

    const handleRecenterChange = () => {
        if (!graph) {
            setPosition(initPosition)
        } else {
            let avgX = 0;
            let avgY = 0;
            let numNodes = Object.keys(nodePositions).length;
            console.log("NUM:" + numNodes)
            for (let i = 0; i < numNodes; i++) {
                avgX += nodePositions[i].init.x
                avgY += nodePositions[i].init.y
                console.log(nodePositions[i].init.x + " | " + nodePositions[i].init.y)
            }
            console.log(avgX +" | " + avgY)
            avgX /= numNodes;
            avgY /= numNodes;

            let newPos = {x: avgX, y: avgY};
            console.log(newPos)
            setPosition(newPos)
        }
    }

    return (
        <div
            className={"element-container " + (lock ? "red-outline" : "")}
            style={{ height: `${props.height}px` }}
        >
            <div className="container-buttons">
                <button
                    className="btn"
                    onClick={() => {
                        // zoom and drag reset are handled here
                        handleRecenterChange();
                        //setPosition(initPosition);
                        setScale(s);
                        setKey(key + 1);
                    }}
                    title="Re-center array"
                >
                    <FontAwesomeIcon
                        icon={["fas", "down-left-and-up-right-to-center"]}
                        className="fa"
                    />
                </button>
                {lock ? (
                    <button
                        className="btn"
                        onClick={() => {
                            setLock(!lock);
                        }}
                        title="Unlock pan & zoom"
                    >
                        <FontAwesomeIcon
                            icon={["fas", "unlock"]}
                            className="fa"
                        />
                    </button>
                ) : (
                    <button
                        className="btn"
                        onClick={() => {
                            // lock
                            setLock(!lock);
                        }}
                        title="Lock pan & zoom"
                    >
                        <FontAwesomeIcon
                            icon={["fas", "lock"]}
                            className="fa"
                        />
                    </button>
                )}
                <button
                    className="btn"
                    onClick={() => {
                        // decrease scale
                        handleScaleChange(-1);
                    }}
                    title="Zoom out"
                >
                    <FontAwesomeIcon
                        icon={["fas", "magnifying-glass-minus"]}
                        className="fa"
                    />
                </button>
                <button
                    className="btn"
                    onClick={() => {
                        // increase scale
                        handleScaleChange(1);
                    }}
                    title="Zoom in"
                >
                    <FontAwesomeIcon
                        icon={["fas", "magnifying-glass-plus"]}
                        className="fa"
                    />
                </button>
            </div>

            <div className="wrapper" style={style}>
                <Draggable
                    nodeRef={nodeRef}
                    scale={scale}
                    key={key}
                    position={position}
                    disabled={lock}
                >
                    {/* Children are rendered within this component */}
                    <div ref={nodeRef} className="children-container noselect">
                        <div style={{ margin: "auto" }}>
                            {
                                // cloning child to pass props
                                React.cloneElement(props.children, {
                                    scale,
                                    center: {
                                        x: -initPosition.x,
                                        y: -initPosition.y,
                                    },
                                })

                                // props.children
                            }
                        </div>
                    </div>
                </Draggable>
            </div>
            {props.staticChildren ? (
                <div className="static-children">{props.staticChildren}</div>
            ) : null}
        </div>
    );
};

export default VisualizerContainer;
