import React from "react";
import AlgoFetcher from "../apis/AlgoFetcher";
import "./common.css";

/**
 * This is a wrapper function for any pages that do algorithms.
 * Follows the Higher Order Components pattern to include control buttons'
 * functions to all algorithm pages without having to include them
 * in every single page.
 */

// NOTE: right now it's only containing common functions, could add common components
const algorithmPages = (OriginalPage, algorithmUrl) => {
    class AlgorithmPages extends React.Component {
        constructor(props) {
            super(props);
            this.inputRef = React.createRef();
            this.playTimer = undefined;
            this.state = {
                width: props.width, // unused
                height: props.height, // unused
                array: [], // hold the current
                algorSteps: { steps: [], success: false },
                currentStep: 0,
                playSpeed: 5,
                playing: false,
            };

            var rands = [];
            while (rands.length < 15) {
                var n = Math.floor(Math.random() * 100);
                rands.push(n);
            }
            if (props.sort) rands.sort((a, b) => a - b);

            for (var i = 0; i < 15; i++) {
                this.state.array.push({ id: i, value: rands[i] });
            }
        }

        // step forward the algorithm, use for button
        stepForward = () => {
            this.setState({
                currentStep: Math.min(
                    this.state.currentStep + 1,
                    this.state.algorSteps.steps.length
                ),
            });
            this.doPause();
        };

        // step backward the algorithm
        stepBackward = () => {
            this.setState({
                currentStep: Math.max(this.state.currentStep - 1, 0),
            });
            this.doPause();
        };

        /**
         * Decide how to draw blocks on the array.
         * Use by passing to the Array1D or any other visual components.
         *
         * We expect the json returned from the backend to include an
         * array of steps and a success flag.
         *
         * Each step also contains a description to describe the step,
         * used for the logger.
         *
         * Additionally, it can contain extra information depends on the
         * algorithm.
         */
        drawBlocks = () => {
            // just a template, every algorithm has its own display method
            // and thus this method is defined in their respective page.
        };

        // request the backend to perform the algorithm
        doAlgorithm = async () => {
            this.doPause();
            var input = parseInt(this.inputRef.current.value);
            var array = this.state.array.map((o) => o.value);
            var data = { array: array, target: input };

            try {
                let response = await AlgoFetcher.post(algorithmUrl, data);
                this.setState({
                    algorSteps: response.data.result,
                    currentStep: 0,
                });
            } catch (err) {
                console.log(err);
            }
        };

        // reset the current step back to 0
        doReset = () => {
            this.setState({ currentStep: 0 });
            this.doPause();
        };

        /**
         * For the play button.
         *
         * Automatically increment the step at an interval.
         */
        doPlay = () => {
            this.updateConsoleText();
            this.doPause();
            // restart the current step if the user press play at last step
            if (this.state.currentStep === this.state.algorSteps.steps.length) {
                this.setState({ currentStep: 0 });
            }

            if (this.state.currentStep < this.state.algorSteps.steps.length) {
                this.playStepLoop();
            }
        };

        /**
         * Helper function for doPlay()
         * Step the algorithm once and reestablish the timer loop.
         */
        playStepLoop = () => {
            if (this.state.currentStep === this.state.algorSteps.steps.length) {
                this.doPause();
            } else {
                this.stepForward();
                var interval =
                    7500 / Math.sqrt(Math.pow(Math.E, this.state.playSpeed));
                this.playTimer = setTimeout(this.playStepLoop, interval);
                this.setState({ playing: true });
            }
        };

        // pause the algorithm if running
        doPause = () => {
            if (this.playTimer) {
                window.clearTimeout(this.playTimer);
                this.playTimer = undefined;
                this.setState({ playing: false });
            }
        };

        // after all component are ready at the beginning of loading the page,
        // do the algorithm once
        componentDidMount = () => {
            if (this.state.algorSteps.steps.length === 0) {
                this.doAlgorithm();
            }
        };

        /**
         * For the speed slider.
         *
         * @param {*} speed parse from the slider element
         */
        updateSpeed = (speed) => {
            this.setState({ playSpeed: speed });
        };

        /**
         * Update the target input box. Used to update this box
         * on user array click.
         *
         * DOES NOT UPDATE INTERNAL (STATE) TARGET VALUE
         *
         * @param {*} e the html element of the array block
         */
        updateTargetBoxValue = (e) => {
            this.inputRef.current.value = e.target.innerHTML;
        };

        // cheat to update state from children
        // should use redux/provider or other technique
        // to handle the state flow of the application
        setStateFromChild = (state) => {
            this.setState(state);
        };

        render = () => {
            return (
                <React.Fragment>
                    {/* pass the necessary functions/state variables as props to the original page */}
                    <OriginalPage
                        stepForward={this.stepForward}
                        stepBackward={this.stepBackward}
                        doAlgorithm={this.doAlgorithm}
                        doReset={this.doReset}
                        doPlay={this.doPlay}
                        doPause={this.doPause}
                        updateSpeed={this.updateSpeed}
                        updateTargetBoxValue={this.updateTargetBoxValue}
                        setStateFromChild={this.setStateFromChild}
                        inputRef={this.inputRef}
                        boardRef={this.boardRef}
                        algorithmUrl={algorithmUrl}
                        /* Passing all state variables */
                        {...this.state}
                        /* passing all props */
                        {...this.props}
                    />
                </React.Fragment>
            );
        };
    }

    return AlgorithmPages;
};

export default algorithmPages;
