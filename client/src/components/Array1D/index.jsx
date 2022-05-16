/**
 * Handle the display of the 1D array.
 */

import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Array1D.css";
import { useSelector } from "react-redux";
import Draggable from "react-draggable";

const Array1D = (props) => {
    const array = useSelector((state) => state.global.array);
    const [scale, setScale] = useState(1);

    // these two states are for position reset
    const [position, setPosition] = useState(null);
    const [key, setKey] = useState(1);

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
    const handleScaleChange = (event) => {
        let d = 0;

        if (event.deltaY > 0) {
            d = Math.max(0.6, scale + (0.1 * event.deltaY) / -100);
        } else {
            d = Math.min(1.4, scale + (0.1 * event.deltaY) / -100);
        }
        setScale(d);
    };

    return (
        <div
            className="table-container"
            onWheel={(e) => {
                handleScaleChange(e);
            }}
        >
            <div className="reset-position-button">
                <button
                    className="btn"
                    onClick={() => {
                        setPosition({ x: 0, y: 0 });
                        setKey(key + 1);
                    }}
                    title="Reset array position"
                >
                    <FontAwesomeIcon icon="fa-arrows-rotate" className="fa" />
                </button>
            </div>

            <div className="wrapper" style={style}>
                <Draggable
                    nodeRef={nodeRef}
                    scale={scale}
                    key={key}
                    position={position}
                >
                    <table ref={nodeRef} className="elements">
                        <tbody>
                            {/* Draw the individual array elements.
                             * Using the drawBlock() function from the parent component.
                             */}
                            <tr className="value-row">
                                <td></td>
                                {props.drawBlocks()}
                            </tr>
                            {/* Draw the indexes below the main array. Currently hardcoded for 15 elements */}
                            <tr className="index-row">
                                <td>Index</td>
                                {[...Array(array.length).keys()].map((v) => (
                                    <td key={v * Math.random()}>{v}</td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </Draggable>
            </div>
        </div>
    );
};

export default Array1D;
