/**
 * Handle everything related to algorithm steping.
 * Currently include the current step counter and a detail console log.
 */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import "./StepTracker.css";

const StepTracker = (props) => {
    const currentStep = useSelector((state) => state.global.currentStep);
    const algorSteps = useSelector((state) => state.global.algorSteps);
    const [expanded, setExpanded] = useState(false);
    const [pinned, setPinned] = useState(false);
    const consoleRef = useRef();

    useEffect(() => {
        // handle automatic scroll
        const toScroll =
            Math.min(algorSteps.steps.length, currentStep) -
            1 -
            (expanded ? 1 : 0);

        if (consoleRef.current.children[toScroll])
            consoleRef.current.children[toScroll].scrollIntoView();
    }, [currentStep, expanded]);

    return (
        <div className="step-tracker-container">
            {/* Console */}
            <div
                className="console"
                ref={consoleRef}
                style={{
                    height: `${1.5 * (expanded ? 5 : 1)}em`,
                }}
                onMouseEnter={() => setExpanded(true)}
                onMouseLeave={() => {
                    if (!pinned) setExpanded(false);
                }}
            >
                {algorSteps.steps.map((e, i) => {
                    // string to return
                    let s = `${i + 1}`.padStart(4, " ") + `. ${e.description}`;
                    // mark and bold the line if it is the current step
                    if (currentStep === i + 1) {
                        s = (
                            <b
                            //className="step-highlight-border"
                            >
                                {" > " + s}
                            </b>
                        );
                    } else {
                        s = "   " + s;
                    }
                    return <div key={i}>{s}</div>;
                })}
            </div>
            <FontAwesomeIcon
                id="pin-icon"
                icon="fa-solid fa-thumbtack"
                onClick={() => {
                    if (!pinned) {
                        setPinned(true);
                        setExpanded(true);
                    } else {
                        setPinned(false);
                        setExpanded(false);
                    }
                }}
                style={
                    pinned
                        ? {
                              transform: "rotate(80deg)",
                              right: "2px",
                              top: "6px",
                          }
                        : null
                }
            />
        </div>
    );
};

export default StepTracker;
