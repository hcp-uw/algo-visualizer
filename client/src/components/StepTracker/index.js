/**
 * Handle everything related to algorithm steping.
 * Currently include the current step counter and a detail console log.
 */

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSpring, animated } from "react-spring";
import { updateStep } from "../../redux/stateSlice";
import "./StepTracker.css";

const StepTracker = (props) => {
    const currentStep = useSelector((state) => state.global.currentStep);
    const algorSteps = useSelector((state) => state.global.algorSteps);
    const dispatch = useDispatch();

    const totalStep = algorSteps.steps.length ? algorSteps.steps.length : -1;

    // scroll the console to the right step
    const { scroll } = useSpring({
        scroll: (currentStep - 4) * 24,
    });

    const handleProgressBarClick = (e) => {
        const offset = Math.max(e.nativeEvent.offsetX, 0);
        const width = e.nativeEvent.target.clientWidth;
        const step = Math.round((offset / width) * totalStep);
        dispatch(updateStep({ currentStep: step, prevStep: step }));
    };

    return (
        <div className="step-tracker-container">
            <span>Step:</span>
            {/* Progress bar */}
            <div
                onClick={(e) => handleProgressBarClick(e)}
                className="step-progress-bar"
            >
                <div
                    className="step-progress"
                    style={{ width: `${(currentStep / totalStep) * 100}%` }}
                ></div>
                <span className="step-label">
                    <b>{currentStep}</b>/
                    {algorSteps.steps.length ? algorSteps.steps.length : 0}
                </span>
            </div>

            {/* Console */}
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
