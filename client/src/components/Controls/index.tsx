/**
 * Handle any controls UI for the page.
 * Currently includes: speed slider, build, play/pause, forward/backward, reset buttons
 */

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Controls.css";
import { useDispatch, useSelector } from "react-redux";
import AlgoFetcher from "../../apis/AlgoFetcher";
import {
    updateAlgorSteps,
    updateArray,
    updateStep,
} from "../../redux/stateSlice";
import {
    updateArrayInput,
    updateGraphEdges,
    updateGraphNodes,
    updateIsGraphInputChanged,
    updatePrevArrayInput,
    updatePrevSingleInput,
} from "../../redux/inputStateSlice";
import useInterval from "../hooks/useInterval";
import { makeRandomArray } from "../../utilities/utilities";
import { Spinner } from "react-bootstrap";
import { RootState } from "../../redux/configureStore";
import { useQuery } from "react-query";
import {
    AlgorithmResultType,
    MergeSortResultType,
    SortAlgorithmResultType,
} from "../../AlgoResultTypes";
import { Edge, ExtraData } from "../../CommonTypes";
import { toast } from "react-toastify";
import SingleInput from "../SingleInput";
import ArrayInput from "../ArrayInput";

type AlgorithmType = "arrayInput" | "singleInput" | "graphInput";

const Controls = ({ ...props }) => {
    const extraData: ExtraData = props.extraData || [];
    const require: AlgorithmType[] = props.require || [];

    // global state variables we pull from redux store
    let currentStep = useSelector(
        (state: RootState) => state.global.currentStep
    );
    const algorSteps = useSelector(
        (state: RootState) => state.global.algorSteps
    );

    // local state variables
    const [playSpeed, setSpeed] = useState<number>(5);
    // a 'playing' flag is necessary since clearing play interval alone
    // does not trigger a component rerender
    const [playing, setPlaying] = useState<boolean>(false);

    // saving a previous value for input box, for glowing animation of buttons
    const singleInput = useSelector(
        (state: RootState) => state.input.singleInput
    );
    const prevSingleInput = useSelector(
        (state: RootState) => state.input.prevSingleInput
    );

    // states related to array input box
    const prevArrayInput = useSelector(
        (state: RootState) => state.input.prevArrayInput
    );

    const arrayInput = useSelector(
        (state: RootState) => state.input.arrayInput
    );

    const isArrayInputValid = useSelector(
        (state: RootState) => state.input.isArrayInputValid
    );

    const nodes = useSelector((state: RootState) => state.input.graphNodes);

    const edges = useSelector((state: RootState) => state.input.graphEdges);

    const isGraphInputChanged = useSelector(
        (state: RootState) => state.input.isGraphInputChanged
    );

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
        if (require.includes("singleInput")) {
            dispatch(updatePrevSingleInput(singleInput));
        }
        if (require.includes("arrayInput")) {
            dispatch(updatePrevArrayInput(arrayInput));
        }
        if (require.includes("graphInput")) {
            dispatch(updateIsGraphInputChanged(false));
        }

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
                extraData[i].updater(singleInput);
            }
        }

        // trigger a toast
        toast.success("Algorithm fetched!", {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    const onError = (error: any) => {
        // trigger a toast
        toast.error(error.message, {
            position: "bottom-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        console.log(error);
    };

    /**
     * Handle state setup before sending the request for algorithm fetch.
     */
    const fetchAlgorithm = () => {
        doPause();
        let toSend: {
            array?: number[];
            target?: number;
            nodes?: string[];
            edges?: Edge[];
        } = {};
        if (require.includes("arrayInput")) {
            // if the input array does not exist (case of error or new page load)
            // the request is made on a random array instead
            let arrInput: number[] = arrayInput
                ? arrayInput.split(",").map((e) => parseInt(e))
                : makeRandomArray(props.requestSortedArray || false);
            dispatch(updateArray(arrInput));
            dispatch(updateArrayInput(arrInput.toString()));
            toSend.array = arrInput;
        }

        if (require.includes("singleInput")) {
            toSend.target = parseInt(singleInput);
        }

        if (require.includes("graphInput")) {
            // only sending the ids of nodes
            if (nodes.length === 0 && edges.length === 0) {
                // default values
                toSend.nodes = ["0", "1", "2", "3", "4"];
                toSend.edges = [
                    { n1: "0", n2: "1" },
                    { n1: "1", n2: "2" },
                    { n1: "0", n2: "3" },
                    { n1: "1", n2: "4" },
                ];
                dispatch(updateGraphNodes(toSend.nodes));
                dispatch(updateGraphEdges(toSend.edges));
            } else {
                toSend.nodes = nodes;
                toSend.edges = edges;
            }
        }

        return AlgoFetcher.post(props.algorithmUrl, toSend);
    };

    const { isLoading, data, isError, error, isFetching, refetch } = useQuery(
        "algorithm-fetch",
        fetchAlgorithm,
        {
            onSuccess: onAlgorithmFetched,
            onError,
            enabled: true, // triggered once on page load
            refetchOnWindowFocus: false,
            retry: 1,

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

    const algorithmFetchAvailable =
        (singleInput !== prevSingleInput ||
            arrayInput !== prevArrayInput ||
            isGraphInputChanged) &&
        isArrayInputValid;
    // spawn a toast when change is available
    if (algorithmFetchAvailable) {
        toast.info("Algorithm fetch available!", {
            toastId: "algorithm-change",
            position: "top-right",
            autoClose: false,
            theme: "colored",
        });
    } else {
        toast.dismiss("algorithm-change");
    }

    return (
        <React.Fragment>
            <div className="centered">
                {/* Array Input */}
                <div className="array-input-container">
                    {/* search input box (if applied) */}
                    {require.includes("singleInput") ? (
                        <SingleInput></SingleInput>
                    ) : null}

                    {require.includes("arrayInput") ? (
                        <ArrayInput
                            requestSortedArray={props.requestSortedArray}
                        ></ArrayInput>
                    ) : null}
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
                            (algorithmFetchAvailable
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
