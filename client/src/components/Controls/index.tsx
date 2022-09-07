/**
 * Handle any controls UI for the page.
 * Currently includes: speed slider, build, play/pause, forward/backward, reset buttons
 */

import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Controls.css";
import { useDispatch, useSelector } from "react-redux";
import AlgoFetcher from "../../apis/AlgoFetcher";
import {
    updateAlgorSteps,
    updateArray,
    updateStep,
} from "../../redux/stateSlice";
import useInterval from "../hooks/useInterval";
import { makeRandomArray } from "../../utilities/utilities";
import { OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import { RootState } from "../../redux/configureStore";
import { useQuery } from "react-query";
import {
    AlgorithmResultType,
    MergeSortResultType,
    SortAlgorithmResultType,
} from "../../AlgoResultTypes";
import { ExtraData } from "../../CommonTypes";

const Controls = ({ ...props }) => {
    const extraData: ExtraData = props.extraData || [];
    const require: string[] = props.require || [];

    // global state variables we pull from redux store
    let currentStep = useSelector(
        (state: RootState) => state.global.currentStep
    );
    const algorSteps = useSelector(
        (state: RootState) => state.global.algorSteps
    );
    const array = useSelector((state: RootState) => state.global.array);

    // local state variables
    const [playSpeed, setSpeed] = useState<number>(5);
    // a 'playing' flag is necessary since clearing play interval alone
    // does not trigger a component rerender
    const [playing, setPlaying] = useState<boolean>(false);

    // saving a previous value for input box, for glowing animation of buttons
    const [numInput, setNumInput] = useState("");
    const [prevNumInput, setPrevNumInput] = useState("");
    const inputBoxRef = useRef<HTMLInputElement>(null);

    // states related to array input box
    const [prevArrayInput, setPrevArrayInput] = useState<string>(
        array.toString()
    );
    const [arrayInput, setArrayInput] = useState<string>(array.toString()); // string
    const [validInput, setValidInput] = useState<boolean>(true);
    const [validInputCode, setValidInputCode] = useState<number[]>([]);

    // miscellaneous variables
    const interval = 7500 / Math.sqrt(Math.pow(Math.E, playSpeed));
    const totalStep = algorSteps.steps.length ? algorSteps.steps.length : -1;
    const dispatch = useDispatch();

    // set up the loop for automatic play
    // only activates if the 'playing' variable is true
    useInterval(
        () => {
            stepForward();
        },
        playing ? interval : null
    );

    // // function that update input box
    // const updateTargetBoxValue = (e: React.MouseEvent<HTMLElement>) => {
    //     let inputBox = e.target as HTMLInputElement;
    //     if (inputBoxRef.current) {
    //         inputBoxRef.current.value = inputBox.innerHTML;
    //         setNumInput(inputBox.innerHTML);
    //     }
    // };

    const handleProgressBarClick = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        let target = e.nativeEvent.target as HTMLDivElement;
        if (target) {
            const offset = Math.max(e.nativeEvent.offsetX, 0);
            const width = target.clientWidth;
            const step = Math.round((offset / width) * totalStep);
            dispatch(updateStep({ currentStep: step }));
        }
    };

    const randomizeArrayInput = (sorted: boolean) => {
        setArrayInput(makeRandomArray(sorted).toString());
    };

    // step forward the algorithm, use for button
    const stepForward = () => {
        let newStep = Math.min(currentStep + 1, algorSteps.steps.length);
        if (newStep !== currentStep) {
            dispatch(
                updateStep({
                    currentStep: newStep,
                })
            );
        } else {
            // at the of possible steps, just pause
            doPause();
        }
    };

    // step backward the algorithm
    const stepBackward = () => {
        let newStep = Math.max(currentStep - 1, 0);
        if (newStep !== currentStep) {
            dispatch(
                updateStep({
                    currentStep: newStep,
                })
            );
            doPause();
        }
    };

    /**
     * Callback that handle data fetched from backend
     *
     * @param data
     */
    const onAlgorithmFetched = (data: any) => {
        // data is empty then dont do anything
        if (!data) return;

        let dataResult: AlgorithmResultType = data.data.result;
        // udpate algorithm steps
        dispatch(
            updateAlgorSteps({
                algorSteps: dataResult,
            })
        );
        // set previous variables to most updated value used in the algorithm request
        setPrevNumInput(numInput);
        setPrevArrayInput(array.toString());

        // update any miscellaneous data if available
        for (let i = 0; i < extraData.length; i++) {
            if (extraData[i].key === "swap") {
                // sort algorithms should always have swaps
                let tempData = dataResult as SortAlgorithmResultType;

                // update swap
                // WHY DOES THE CLIENT HAVE TO CALCULATE SWAPS
                let c = 0;
                let s = tempData.steps.map((e) => {
                    c += e.swapped ? 1 : 0;
                    return c;
                });
                // define the step -1
                s[-1] = 0;
                extraData[i].updater(s);
            } else if (extraData[i].key === "compares") {
                let tempData = dataResult as MergeSortResultType;
                // some algorithm require compare counts

                let s = tempData.steps.map((e) => e.compareCount);
                s[-1] = 0;
                extraData[i].updater(s);
            } else if (extraData[i].key === "target") {
                extraData[i].updater(numInput);
            }
        }
    };

    const onError = (error: any) => {
        console.log(error);
        // trigger a toast or something
    };

    /**
     * Handle state setup before sending the request for algorithm fetch.
     */
    const fetchAlgorithm = () => {
        doPause();
        // if the input array does not exist (case of error or new page load)
        // the request is made on a random array instead
        let arrInput: number[] = arrayInput
            ? arrayInput.split(",").map((e) => parseInt(e))
            : makeRandomArray(props.requestSortedArray || false);

        dispatch(updateArray(arrInput));
        setArrayInput(arrInput.toString());
        return AlgoFetcher.post(props.algorithmUrl, {
            data: arrInput,
            target: parseInt(numInput),
        });
    };

    const { isLoading, data, isError, error, isFetching, refetch } = useQuery(
        "algorithm-fetch",
        fetchAlgorithm,
        {
            onSuccess: onAlgorithmFetched,
            onError,
            enabled: true, // triggered once on page load
            // cacheTime: 1000
        }
    );

    // reset the current step back to 0
    const doReset = () => {
        dispatch(updateStep({ currentStep: 0 }));
        doPause();
    };

    /**
     * For the play button.
     *
     * Automatically increment the step at an interval.
     */
    const doPlay = () => {
        // restart the current step if the user press play at last step
        if (currentStep === algorSteps.steps.length) {
            dispatch(updateStep({ currentStep: 0 }));
            //setPlaying(false);
        }

        if (currentStep < algorSteps.steps.length) {
            stepForward();
            setPlaying(true);
        }
    };

    // pause the algorithm if running
    const doPause = () => {
        setPlaying(false);
    };

    /**
     * For the speed slider.
     *
     * @param {number} speed parse from the slider element
     */
    const updateSpeed = (speed: string): void => {
        let spd = parseInt(speed);
        setSpeed(spd);
    };

    const checkArrayInput = (arr: string[]) => {
        let code = [];
        // 5 to 20 elements, range 1-99
        if (arr.length < 5 || arr.length > 20) code.push(1);

        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === "" && !code.includes(3)) code.push(3);
            else if (
                (parseInt(arr[i]) < 1 || parseInt(arr[i]) > 99) &&
                !code.includes(2)
            )
                code.push(2);
        }

        return { status: code.length === 0, code: code };
    };

    const getWarningText = () => {
        let warnings = [];
        if (validInputCode.includes(1))
            warnings.push("Array must have 5-20 elements.");
        if (validInputCode.includes(2))
            warnings.push("Elements must be in range 1-99.");
        if (validInputCode.includes(3))
            warnings.push("Elements must be comma-separated.");
        return warnings;
    };

    return (
        <React.Fragment>
            <div className="centered">
                {/* Array Input */}
                <div className="array-input-container">
                    {/* search input box (if applied) */}
                    {require.includes("singleInput") ? (
                        <div className="input-container">
                            <input
                                ref={inputBoxRef}
                                className="num-input"
                                type="number"
                                placeholder="Search for"
                                value={numInput}
                                onChange={(e) => {
                                    setNumInput(e.target.value);
                                }}
                            ></input>
                        </div>
                    ) : null}

                    {/* array input box  */}
                    <input
                        className={
                            "array-input " + (validInput ? "" : "warning")
                        }
                        placeholder="Array"
                        value={arrayInput}
                        onKeyDown={(e) => {
                            // preventing invalid inputs here, or else the cursor will
                            // move to the end whenever user type wrong input
                            const allowedKeys = [
                                "backspace",
                                "arrowleft",
                                "arrowright",
                                "delete",
                            ];
                            if (
                                /[^\d,]/g.test(e.key) &&
                                !e.ctrlKey &&
                                !allowedKeys.includes(e.key.toLowerCase())
                            ) {
                                e.preventDefault();
                            }
                        }}
                        onChange={(e) => {
                            // a second input check here whenever user copy paste input
                            // behavior: only keep the digits/comma portion of the pasted input
                            let newText = e.target.value.replace(/[^\d,]/g, "");
                            setArrayInput(newText);
                            let t = checkArrayInput(newText.split(","));
                            setValidInput(t.status);
                            setValidInputCode(t.code);
                        }}
                    ></input>
                    {validInput ? null : (
                        <OverlayTrigger
                            key="top"
                            placement="top"
                            overlay={
                                <Tooltip id="tooltip-top">
                                    {getWarningText().map((w) => (
                                        <li key={w}>{w}</li>
                                    ))}
                                </Tooltip>
                            }
                        >
                            <div id="warning-icon">
                                <FontAwesomeIcon
                                    icon={["fas", "triangle-exclamation"]}
                                    className="fa"
                                />
                            </div>
                        </OverlayTrigger>
                    )}

                    {/* Randomize button*/}
                    <button
                        className="btn"
                        title="Randomize input"
                        onClick={() =>
                            randomizeArrayInput(props.requestSortedArray)
                        }
                    >
                        <FontAwesomeIcon
                            icon={["fas", "shuffle"]}
                            className="fa"
                        />
                    </button>
                </div>

                {/* wrapper for the buttons */}
                <div className="controls">
                    {/* play/pause button, conditioned by the 'playing' state */}
                    {playing ? (
                        <button
                            className="btn glow-border-anim"
                            onClick={doPause}
                        >
                            <FontAwesomeIcon
                                icon={["fas", "pause"]}
                                className="fa"
                            />
                        </button>
                    ) : (
                        <button className="btn glow-border" onClick={doPlay}>
                            <FontAwesomeIcon
                                icon={["fas", "play"]}
                                className="fa"
                            />
                        </button>
                    )}

                    {/* step backward button */}
                    <button
                        className={"btn" + (currentStep > 0 ? "" : " disabled")}
                        title="step backward once"
                        onClick={stepBackward}
                    >
                        <FontAwesomeIcon
                            icon={["fas", "backward-step"]}
                            className="fa"
                        />
                    </button>

                    {/* Progress bar */}
                    <div
                        onClick={(e) => handleProgressBarClick(e)}
                        className="step-progress-bar"
                    >
                        <div
                            className="step-progress"
                            style={{
                                width: `${(currentStep / totalStep) * 100}%`,
                            }}
                        ></div>
                        <span className="step-label">
                            <b>{currentStep}</b>/
                            {algorSteps.steps.length
                                ? algorSteps.steps.length
                                : 0}
                        </span>
                    </div>

                    {/* step forward button */}
                    <button
                        className={
                            "btn" +
                            (currentStep < algorSteps.steps.length
                                ? ""
                                : " disabled")
                        }
                        title="step forward once"
                        onClick={stepForward}
                    >
                        <FontAwesomeIcon
                            icon={["fas", "forward-step"]}
                            className="fa"
                        />
                    </button>

                    {/* reset button: reset the current step to 0 */}
                    <button
                        className="btn"
                        title="restart algorithm"
                        onClick={doReset}
                    >
                        <FontAwesomeIcon
                            icon={["fas", "rotate-left"]}
                            className="fa"
                        />
                    </button>
                </div>

                {/* speed slider */}
                <div id="speed-slider-container">
                    <label htmlFor="speed-slider">Speed:&nbsp;</label>
                    <input
                        id="speed-slider"
                        type="range"
                        min="2"
                        max="10"
                        defaultValue={5}
                        onChange={(e) => updateSpeed(e.target.value)}
                    ></input>
                </div>

                <div style={{ margin: "0px" }}>
                    {/* build button that request the backend to perform algorithm */}
                    <button
                        className={
                            "btn" +
                            ((numInput !== prevNumInput ||
                                arrayInput !== prevArrayInput) &&
                            validInput
                                ? " build-glow-border"
                                : " disabled")
                        }
                        title="do algorithm"
                        onClick={() => {
                            refetch();
                        }}
                    >
                        <span>Fetch Algorithm </span>
                        <FontAwesomeIcon
                            icon={["fas", "wrench"]}
                            className="fa"
                        />
                    </button>

                    <Spinner
                        animation="border"
                        className={isLoading ? "loading-spinner-show" : ""}
                        id="loading-spinner"
                        role="status"
                    ></Spinner>
                </div>
            </div>
        </React.Fragment>
    );
};
export default Controls;
