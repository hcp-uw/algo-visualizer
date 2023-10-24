import React from "react";
import "./Stack.css";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/configureStore";
import { DepthFirstSearchResultType } from "../../AlgoResultTypes";
import { CSSTransition, TransitionGroup } from "react-transition-group";
/**
 * this component will use the stack in algorithmsteps
 *
 * @param param0
 * @returns
 */
const Stack = ({ ...props }) => {
    const algorSteps = useSelector(
        (state: RootState) => state.global.algorSteps
    ) as DepthFirstSearchResultType;

    const currentStep = useSelector(
        (state: RootState) => state.global.currentStep
    );

    const isStackReady =
        algorSteps.steps.length > 0 &&
        currentStep > 0 &&
        algorSteps.steps[0].stack;

    const stack = isStackReady
        ? algorSteps.steps[currentStep - 1].stack.map((e: { id: string; from: string }) => e.id)
        : [];

    const toDisplay = stack.length < 10 ? stack : ["...", ...stack.slice(-9)];

    return (
        <div className="stack-container">
            <div className="stack-item-holder">
                <TransitionGroup>
                    {toDisplay.map((item: string, index: number) => (
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
