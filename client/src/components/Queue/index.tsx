import React from "react";
import "./Queue.css";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/configureStore";
import { BreadthFirstSearchResultType } from "../../AlgoResultTypes";
import { CSSTransition, TransitionGroup } from "react-transition-group";

/**
 * this component will use the queue in algorithmsteps
 *
 * @param param0
 * @returns
 */
const Queue = ({ ...props }) => {
    const algorSteps = useSelector(
        (state: RootState) => state.global.algorSteps
    ) as BreadthFirstSearchResultType;

    const currentStep = useSelector(
        (state: RootState) => state.global.currentStep
    );

    const isQueueReady =
        algorSteps.steps.length > 0 &&
        currentStep > 0 &&
        algorSteps.steps[0].queue;

    const queue = isQueueReady
        ? algorSteps.steps[currentStep - 1].queue.map((e: { id: string; from: string }) => e.id)
        : [];

    const toDisplay = queue.length < 10 ? queue : ["...", ...queue.slice(-9)];

    // STACK ANIMATION IS BUGGY WHEN STACK EXCEED LIMITED AMOUNT

    return (
        <div className="queue-container">
            <p id="queue-back">Enter Queue</p>
            <div className="queue-item-holder">
                {toDisplay.map((item: string, index: number) => (
                    <div
                        style={{
                            top: `${17.5 - index * 3.8}rem`,
                        }}
                        className={
                            "queue-item " +
                            (item === "..." ? "queue-item-extra " : "")
                        }
                    >
                        {item}
                    </div>
                ))}
            </div>
            <p id="queue-front">Leave Queue</p>
        </div>
    );
};

export default Queue;
