import React, { useEffect, useState } from "react";
import "./Stack.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/configureStore";
import {
    resetSingleInput,
    updateSingleInput,
} from "../../redux/inputStateSlice";
import { GraphAlgorithmResultType } from "../../AlgoResultTypes";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { copyObject } from "../../utilities/utilities";
/**
 * this component will use the stack in algorithmsteps
 *
 * @param param0
 * @returns
 */
const Stack = ({ ...props }) => {
    const algorSteps = useSelector(
        (state: RootState) => state.global.algorSteps
    ) as GraphAlgorithmResultType;

    const currentStep = useSelector(
        (state: RootState) => state.global.currentStep
    );

    const isStackReady = algorSteps.steps.length > 0 && currentStep > 0;

    const stack = isStackReady
        ? algorSteps.steps[currentStep - 1].stack.map((e) => e.id)
        : [];

    const toDisplay = stack.length < 10 ? stack : ["...", ...stack.slice(-9)];

    // STACK ANIMATION IS BUGGY WHEN STACK EXCEED LIMITED AMOUNT

    return (
        <div className="stack-container">
            <div className="stack-item-holder">
                <TransitionGroup>
                    {toDisplay.map((item, index) => (
                        <CSSTransition
                            timeout={350}
                            key={item + index}
                            classNames="stack-item"
                        >
                            <div
                                style={{
                                    top: `${19 - index * 3.8}rem`,
                                }}
                                className={
                                    "stack-item " +
                                    (item === "..." ? "stack-item-extra" : "")
                                }
                            >
                                {item}
                            </div>
                        </CSSTransition>
                    ))}
                </TransitionGroup>
            </div>
        </div>
    );
};

export default Stack;
