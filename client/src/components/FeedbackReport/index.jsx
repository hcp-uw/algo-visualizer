/**
 * Handle the display of the bug report popup.
 */

import "./FeedbackReport.css";
import AlgoFetcher from "../../apis/AlgoFetcher";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";

const FeedbackReport = (props) => {
    // state for putting the popup on/off
    const [active, setActive] = useState(false);

    // grab data global to send to backend
    const currentStep = useSelector((state) => state.global.currentStep);
    const name = useSelector((state) => state.global.algorithmName);
    const array = useSelector((state) => state.global.array);

    // feedback input box ref
    const inputRef = useRef(null);

    // send data and feedback message to backend
    const handleSendFeedback = () => {
        // trimming the feedback string before send
        // will not send if string is empty (after trim)
        if (inputRef.current.value.trim()) {
            // grab current dimension browser window
            let dimension = {
                width: window.innerWidth,
                height: window.innerHeight,
            };

            // grabbing name of algorithm, current array, current step
            let algorithmData = { name, array, currentStep };

            // make the request
            AlgoFetcher.post("feedback/", {
                message: inputRef.current.value.trim(),
                browserInfo: { dimension },
                algorithmData,
            });

            // clear string in input box
            inputRef.current.value = "";
            // close the popup
            setActive(!active);
        }
    };

    // flip status of popup
    const swapActive = () => {
        setActive(!active);
    };

    return (
        <>
            <div className={active ? "feedback-modal" : "hidden"}>
                {/* The popup overlay */}
                <div className="overlay" onClick={swapActive}></div>

                {/* The popup card */}
                <div className="feedback-popup">
                    {/* Header of card */}
                    <header>
                        <div className="close" onClick={swapActive}></div>
                        <span>Report a bug</span>
                    </header>

                    {/* Body of card */}
                    <section>
                        <label htmlFor="feedback-input">
                            Please describe the issue:
                        </label>

                        <textarea
                            ref={inputRef}
                            type="text"
                            id="feedback-input"
                            name="feedback-input"
                            autoComplete="off"
                            spellCheck={true}
                            maxLength="1023"
                        ></textarea>

                        <div>
                            <button
                                className="btn"
                                onClick={handleSendFeedback}
                            >
                                Submit
                            </button>
                        </div>

                        <span>
                            Your current algorithm visualizer states will be
                            sent with your feedback.
                        </span>
                    </section>
                </div>
            </div>

            {/* The display of the report button to initiate popup */}
            <button className="feedback-button" onClick={swapActive}>
                <FontAwesomeIcon icon="fa-bug" className="fa" />
            </button>
        </>
    );
};

export default FeedbackReport;
