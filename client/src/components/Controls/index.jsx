/**
 * Handle any controls UI for the page.
 * Currently includes: speed slider, build, play/pause, forward/backward, reset buttons
 */

import React, { useState, useEffect } from "react";
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

const Controls = (props) => {
    // global state variables we pull from redux store
    let currentStep = useSelector((state) => state.global.currentStep);
    const algorSteps = useSelector((state) => state.global.algorSteps);
    const array = useSelector((state) => state.global.array);

    // local state variables
    const [playSpeed, setSpeed] = useState(5);
    // a 'playing' flag is necessary since clearing play interval alone
    // does not trigger a component rerender
    const [playing, setPlaying] = useState(false);
    const [loading, setLoading] = useState(true);

    // saving a previous value for input box, for glowing animation of buttons
    const [prevNumInput, setPrevNumInput] = useState(props.numInput);

    // states related to array input box
    const [prevArrayInput, setPrevArrayInput] = useState(array);
    const [arrayInput, setArrayInput] = useState(array); // string
    const [validInput, setValidInput] = useState(true);
    const [validInputCode, setValidInputCode] = useState([]);

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

    const handleProgressBarClick = (e) => {
        const offset = Math.max(e.nativeEvent.offsetX, 0);
        const width = e.nativeEvent.target.clientWidth;
        const step = Math.round((offset / width) * totalStep);
        dispatch(updateStep({ currentStep: step, prevStep: step }));
    };

    const randomizeArrayInput = (sorted) => {
        setArrayInput(makeRandomArray(sorted).toString());
    };

    // step forward the algorithm, use for button
    const stepForward = () => {
        let newStep = Math.min(currentStep + 1, algorSteps.steps.length);
        if (newStep !== currentStep) {
            dispatch(
                updateStep({
                    prevStep: currentStep,
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
                    prevStep: currentStep,
                    currentStep: newStep,
                })
            );
            doPause();
        }
    };

    // request the backend to perform the algorithm
    // the parent page have the option to provide a custom doAlgorithm thru props
    // in that case we use that function instead of the default
    const doAlgorithm = props.doAlgorithm
        ? async (arr) => {
              // since the parent page doesnt have the doPause function, we just call it here
              doPause();
              setLoading(true);
              dispatch(updateArray(arr));
              await props.doAlgorithm(arr);
              setPrevNumInput(props.numInput);
              setPrevArrayInput(arr.toString());
              setLoading(false);
          }
        : async (arr) => {
              // default function
              doPause();
              setLoading(true);
              dispatch(updateArray(arr));
              let input =
                  props.numInput != null ? parseInt(props.numInput) : arr[12];

              let data = { array: arr, target: input };

              try {
                  let response = await AlgoFetcher.post(
                      props.algorithmUrl,
                      data
                  );
                  // udpate algorithm steps
                  dispatch(
                      updateAlgorSteps({
                          algorSteps: response.data.result,
                      })
                  );
                  // update previous values for highlights
                  setPrevNumInput(props.numInput);
                  setPrevArrayInput(arr.toString());

                  // update target (for search algorithms)
                  if (response.data.result.target)
                      props.setCurrentTarget(response.data.result.target);
              } catch (err) {
                  console.log(err);
              }
              //setTimeout(() => setLoading(false), 1000);
              setLoading(false);
          };

    // reset the current step back to 0
    const doReset = () => {
        dispatch(updateStep({ currentStep: 0, prevStep: -1 }));
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
            dispatch(updateStep({ currentStep: 0, prevStep: -1 }));
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
     * @param {*} speed parse from the slider element
     */
    const updateSpeed = (speed) => {
        speed = parseInt(speed);
        setSpeed(speed);
    };

    const checkArrayInput = (arr) => {
        let code = [];
        // 5 to 20 elements, range 1-99
        if (arr.length < 5 || arr.length > 20) code.push(1);

        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === "" && !code.includes(3)) code.push(3);
            else if ((arr[i] < 1 || arr[i] > 99) && !code.includes(2))
                code.push(2);
        }

        return { status: code.length === 0, code: code };
    };

    // do the algorithm once every time the page load
    useEffect(() => {
        let sorted = props.requestSortedArray
            ? props.requestSortedArray
            : false;
        // if the page request a sorted array (binary search)

        let tempArray = makeRandomArray(sorted);

        dispatch(updateArray(tempArray));
        setArrayInput(tempArray.toString());
        doAlgorithm(tempArray);
    }, []);

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
                    {props.searchInputBox}

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
                                    icon="fa-triangle-exclamation"
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
                        <FontAwesomeIcon icon="fa-shuffle" className="fa" />
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
                            <FontAwesomeIcon icon="fa-pause" className="fa" />
                        </button>
                    ) : (
                        <button className="btn glow-border" onClick={doPlay}>
                            <FontAwesomeIcon icon="fa-play" className="fa" />
                        </button>
                    )}

                    {/* step backward button */}
                    <button
                        className={"btn" + (currentStep > 0 ? "" : " disabled")}
                        title="step backward once"
                        onClick={stepBackward}
                    >
                        <FontAwesomeIcon
                            icon="fa-backward-step"
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
                            icon="fa-forward-step"
                            className="fa"
                        />
                    </button>

                    {/* reset button: reset the current step to 0 */}
                    <button
                        className="btn"
                        title="restart algorithm"
                        onClick={doReset}
                    >
                        <FontAwesomeIcon icon="fa-rotate-left" className="fa" />
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
                            ((props.numInput !== prevNumInput ||
                                arrayInput !== prevArrayInput) &&
                            validInput
                                ? " build-glow-border"
                                : " disabled")
                        }
                        title="do algorithm"
                        onClick={() =>
                            doAlgorithm(
                                arrayInput.split(",").map((e) => parseInt(e))
                            )
                        }
                    >
                        <span>Fetch Algorithm </span>
                        <FontAwesomeIcon icon="fa-wrench" className="fa" />
                    </button>

                    <Spinner
                        animation="border"
                        className={loading ? "loading-spinner-show" : ""}
                        id="loading-spinner"
                        role="status"
                    ></Spinner>
                </div>
            </div>
        </React.Fragment>
    );
};
export default Controls;
