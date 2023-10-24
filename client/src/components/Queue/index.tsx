import React from "react";
import "./Queue.css";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/configureStore";
import { BreadthFirstSearchResultType } from "../../AlgoResultTypes";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { current } from "@reduxjs/toolkit";

/**
 * this component will use the queue in algorithmsteps
 *
 * @param param0
 * @returns
 */

var currentIndex = -1;

var newStep = -1;

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

    // This is the queue object in which we will be using
    const queue = isQueueReady
        ? algorSteps.steps[currentStep - 1].queue.map((e: { id: string; from: string }) => e.id)
        : [];

    // Here we might want to add a class to each of the

    const toDisplay = queue.length < 10 ? queue : ["...", ...queue.slice(-9)];

    newStep = currentStep

    const temp = currentIndex
    currentIndex = currentStep;

    return (
        <div className="queueBack-container">
            <div className="text-queue">
                <p id="queueBack-back">Enter Queue</p>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <p id="queueBack-front">Leave Queue</p>
            </div>
            <div className="queueBack-item-holder">
                <TransitionGroup>
                    {toDisplay.map((item: string, index: number) => (
                        <CSSTransition
                            timeout={350}
                            key={item + index}
                            classNames= {temp <= currentStep ? "queue-item" : "queueBack-item"}
                        >
                            <div
                                style={{
                                    top: `${19 - index * 3.8}rem`,
                                }}
                                className={(temp <= currentStep ? "queue-item" : "queueBack-item")
                                        +
                                    (item === "..." ? (temp <= currentStep ? "queue-item-extra" : "queueBack-item-extra") : "")
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

export default Queue;
