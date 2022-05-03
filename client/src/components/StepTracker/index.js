/**
 * Handle everything related to algorithm steping.
 * Currently include the current step counter and a detail console log.
 */

import React from "react";
import { useSelector } from "react-redux";
import { useSpring, animated } from "react-spring";
import "./StepTracker.css";

const StepTracker = (props) => {
    const currentStep = useSelector((state) => state.global.currentStep);
    const algorSteps = useSelector((state) => state.global.algorSteps);

    // scroll the console to the right step
    const { scroll } = useSpring({
        scroll: (currentStep - 4) * 24,
    });

    return (
        <div className="step-tracker-container">
            <span>
                Current step: <b>{currentStep}</b>/
                {algorSteps.steps.length ? algorSteps.steps.length : 0}
            </span>
            <animated.div scrollTop={scroll} className="console">
                {algorSteps.steps.map((e, i) => {
                    // string to return
                    let s =
                        `${i + 1}`.padStart(4, " ") + `. ${e.description} \n`;
                    // mark and bold the line if it is the current step
                    if (currentStep === i + 1) {
                        s = (
                            <b
                                key={s} //className="step-highlight-border"
                            >
                                {" > " + s}
                            </b>
                        );
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
