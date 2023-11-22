import React from "react";
import "./PriorityQueue.css";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/configureStore";
import { DijkstrasSearchResultType } from "../../AlgoResultTypes";
import { CSSTransition, TransitionGroup } from "react-transition-group";

/**
 * this component will use the PriorityQueue in algorithmsteps
 *
 * @param param
 * @returns
 */
const PriorityQueue = ({ ...props }) => {
    const algorSteps = useSelector(
        (state: RootState) => state.global.algorSteps
    ) as DijkstrasSearchResultType;

    const currentStep = useSelector(
        (state: RootState) => state.global.currentStep
    );

    const isPriorityQueueReady =
        algorSteps.steps.length > 0 &&
        currentStep > 0 &&
        algorSteps.steps[0].priorityQueue;

    const priorityQueue = isPriorityQueueReady
        ? algorSteps.steps[currentStep - 1].priorityQueue.map((e: { id: string; from: string, weight: number}) => e.id + " cost:" + e.weight)
        : [];

    const toDisplay = priorityQueue.length < 10 ? priorityQueue : ["...", ...priorityQueue.slice(-9)];

    // STACK ANIMATION IS BUGGY WHEN STACK EXCEED LIMITED AMOUNT

    return (
        <div className="queue-container">
            <p id="queue-back">Enter P-Queue</p>
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
            <p id="queue-front">Leave P-Queue</p>
        </div>
    );
};

export default PriorityQueue;
