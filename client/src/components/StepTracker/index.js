/**
 * Handle everything related to algorithm steping.
 * Currently include the current step counter and a detail console log.
 */

import React from "react";
import { useSpring, animated } from "react-spring";
import "./StepTracker.css";

const StepTracker = (props) => {
    // scroll the console to the right step
    const { scroll } = useSpring({
        scroll: (props.currentStep - 4) * 24,
    });

    return (
        <div className="step-tracker-container">
            <span>
                Current step: <b>{props.currentStep}</b>/
                {props.algorSteps.steps.length
                    ? props.algorSteps.steps.length
                    : 0}
            </span>
            <animated.div scrollTop={scroll} className="console">
                {props.algorSteps.steps.map((e, i) => {
                    // string to return
                    let s =
                        `${i + 1}`.padStart(4, " ") + `. ${e.description} \n`;
                    // mark and bold the line if it is the current step
                    if (props.currentStep === i + 1) {
                        s = <b key={s}>{" > " + s}</b>;
                    } else {
                        s = "   " + s;
                    }
                    return s;
                })}
            </animated.div>
        </div>
    );
};

export default StepTracker;
