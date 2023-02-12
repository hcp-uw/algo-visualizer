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

    const queue = isQueueReady
        ? algorSteps.steps[currentStep - 1].queue.map((e: { id: string; from: string }) => e.id)
        : [];

    const toDisplay = queue.length < 10 ? queue : ["...", ...queue.slice(-9)];

    newStep = currentStep

    if (currentIndex > currentStep) {
        console.log("I WENT INTO HERE (2)!");
        currentIndex = currentStep;
        return (
            <div className="queue-container">
                <div className="text-queue">
                    <p id="queue-back">Enter Queue</p>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <p id="queue-front">Leave Queue</p>
                </div>
                <div className="queue-item-holder">
                    <TransitionGroup>
                        {toDisplay.map((item: string, index: number) => (
                            <CSSTransition
                                timeout={350}
                                key={item + index}
                                classNames={{
                                    enter: 'queueBack-item-enter',
                                    exit: 'queueBack-item-exit',
                                    exitActive: 'queueBack-item-exit-active'
                                }}
                            >
                                <div
                                    style={{
                                        top: `${19 - index * 3.8}rem`,
                                    }}
                                >
                                    {item}
                                </div>
                            </CSSTransition>
                        ))}
                    </TransitionGroup>
                </div>
            </div>
        );
    }

    console.log("I went into (1)");


    currentIndex = currentStep;

    return (
        <div className="queue-container">
            <div className="text-queue">
                <p id="queue-back">Enter Queue</p>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <p id="queue-front">Leave Queue</p>
            </div>
            <div className="queue-item-holder">
                <TransitionGroup>
                    {toDisplay.map((item: string, index: number) => (
                        <CSSTransition
                            timeout={350}
                            key={item + index}
                            classNames="queue-item"
                        >
                            <div
                                style={{
                                    top: `${19 - index * 3.8}rem`,
                                }}
                                className={
                                    "queue-item " +
                                    (item === "..." ? "queue-item-extra" : "")
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


    /*
    if (currentIndex < currentStep) {
        console.log("I WENT INTO HERE (1)!");
        currentIndex = currentStep;
        return (
            <div className="queue-container">
                <div className="text-queue">
                    <p id="queue-back">Enter Queue</p>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <p id="queue-front">Leave Queue</p>
                </div>
                <div className="queue-item-holder">
                    <TransitionGroup>
                        {toDisplay.map((item: string, index: number) => (
                            <CSSTransition
                                timeout={350}
                                key={item + index}
                                classNames="queue-item"
                            >
                                <div
                                    style={{
                                        top: `${19 - index * 3.8}rem`,
                                    }}
                                    className={
                                        "stack-item " +
                                        (item === "..." ? "queue-item-extra" : "")
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
    } else {
        console.log("I WENT INTO HERE (2)!");
        currentIndex = currentStep;
        return (
            <div className="queue-container">
                <div className="text-queue">
                    <p id="queue-back">Enter Queue</p>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <p id="queue-front">Leave Queue</p>
                </div>
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
            </div>
        );
    }
    */
};

export default Queue;
