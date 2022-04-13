/**
 * Handle any controls UI for the page.
 * Currently includes: speed slider, build, play/pause, forward/backward, reset buttons
 */

import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap.css";
import "./Controls.css";

class Controls extends Component {
    render = () => {
        return (
            <React.Fragment>
                <div className="centered">
                    {/* speed slider */}
                    <div>
                        <label htmlFor="speed-slider">Speed:&nbsp;</label>
                        <input
                            id="speed-slider"
                            type="range"
                            min="1"
                            max="11"
                            defaultValue={5}
                            onChange={(e) =>
                                this.props.updateSpeed(e.target.value)
                            }
                        ></input>
                    </div>

                    {/* wrapper for the buttons */}
                    <div className="controls">
                        {/* build button that request the backend to perform algorithm */}
                        <button
                            className="btn"
                            title="do algorithm"
                            onClick={this.props.doAlgorithm}
                        >
                            <span>Build</span>
                            <FontAwesomeIcon icon="fa-wrench" className="fa" />
                        </button>

                        {/* play/pause button, conditioned by the 'playing' state */}
                        {this.props.playing ? (
                            <button
                                className="btn"
                                onClick={this.props.doPause}
                            >
                                <span>Pause</span>
                                <FontAwesomeIcon
                                    icon="fa-pause"
                                    className="fa"
                                />
                            </button>
                        ) : (
                            <button className="btn" onClick={this.props.doPlay}>
                                <span>Play</span>
                                <FontAwesomeIcon
                                    icon="fa-play"
                                    className="fa"
                                />
                            </button>
                        )}

                        {/* step forward button */}
                        <button
                            className="btn"
                            title="step backward once"
                            onClick={this.props.stepBackward}
                        >
                            <span>Backward</span>
                            <FontAwesomeIcon
                                icon="fa-backward-step"
                                className="fa"
                            />
                        </button>

                        {/* step backward button */}
                        <button
                            className="btn"
                            title="step forward once"
                            onClick={this.props.stepForward}
                        >
                            <span>Forward</span>
                            <FontAwesomeIcon
                                icon="fa-forward-step"
                                className="fa"
                            />
                        </button>

                        {/* reset button: reset the current step to 0 */}
                        <button
                            className="btn"
                            title="restart algorithm"
                            onClick={this.props.doReset}
                        >
                            <span>Reset</span>
                            <FontAwesomeIcon
                                icon="fa-rotate-left"
                                className="fa"
                            />
                        </button>
                    </div>
                </div>
            </React.Fragment>
        );
    };
}

export default Controls;
