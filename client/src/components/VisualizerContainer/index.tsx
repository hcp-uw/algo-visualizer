/**
 * Wrap this component around any visual components to make it draggable and zoomable.
 */

import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./VisualizerContainer.css";
import Draggable from "react-draggable";

const VisualizerContainer = ({ ...props }) => {
    let max_scale = props.maxScale || 1.5;
    let min_scale = props.minScale || 0.5;
    let scale_increment = props.scale_increment || 0.1;
    let s = props.scale || 1;

    if (min_scale >= max_scale) throw "minScale must be less or than equal to maxScale"


    let initPosition = props.initPosition || { x: 0, y: 0 };

    // It'll either be min_scale at the least, max_scale at the most, and s if it's in between.
    const [scale, setScale] = useState(Math.min(max_scale, Math.max(min_scale, s)));

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

            // increase scale
            if (delta > 0) {
                // increase scale
                d = Math.min(max_scale, scale + scale_increment);
            } else {
                // decrease scale
                d = Math.max(min_scale, scale - scale_increment);
            }
            setScale(d);
        }
    };

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
                        setPosition(initPosition);
                        setScale(s);
                        // TODO: fix this incrementation thing once Graph Controls is finished
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
