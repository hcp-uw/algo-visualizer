import React, { useRef, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./DepthFirstSearch.css";
import Controls from "../../components/Controls";
import StepTracker from "../../components/StepTracker";
import Graph from "../../components/Graph";
import VisualizerContainer from "../../components/VisualizerContainer";
import { useSelector, useDispatch } from "react-redux";
import AlgorithmPopover from "../../components/AlgorithmPopover";
import { resetSteps, updateAlgorName } from "../../redux/stateSlice";
import { linearSearchDesc } from "../../assets/algorithm-information.js";

const ALGORITHM_URL = "searches/depthfirstsearch/";

const DepthFirstSearch = () => {
    const algorSteps = useSelector((state) => state.global.algorSteps);
    const currentStep = useSelector((state) => state.global.currentStep);
    const array = useSelector((state) => state.global.array);
    const inputBoxRef = useRef();

    const [numInput, setNumInput] = useState();
    const [currentTarget, setCurrentTarget] = useState();

    const dispatch = useDispatch();
    // reset data upon exiting the page
    useEffect(() => {
        // update the name on first load
        dispatch(updateAlgorName(linearSearchDesc.algorithm));

        return () => {
            dispatch(resetSteps());
        };
    }, []);

    // function that update input box
    const updateTargetBoxValue = (e) => {
        inputBoxRef.current.value = e.target.innerHTML;
        setNumInput(e.target.innerHTML);
    };

    const n = 2000;

    return (
        <div className="content">
            <div className="centered">
                <AlgorithmPopover data={linearSearchDesc} />
            </div>

            <VisualizerContainer
                height="700"
                initPosition={{ x: -n / 3, y: -n / 3 }}
            >
                <Graph containerWidth={n} containerHeight={n} />
            </VisualizerContainer>

            <Controls
                numInput={numInput}
                algorithmUrl={ALGORITHM_URL}
                setCurrentTarget={setCurrentTarget}
                searchInputBox={
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
                }
            />
            <div className="centered">Current target: {currentTarget}</div>
            <StepTracker />
        </div>
    );
};

export default DepthFirstSearch;
