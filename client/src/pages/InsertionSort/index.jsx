import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./InsertionSort.css";
import Controls from "../../components/Controls";
import algorithmPages from "../algorithmPages";
import Array1D from "../../components/Array1D";
import AlgoFetcher from "../../apis/AlgoFetcher";
import StepTracker from "../../components/StepTracker";

class InsertionSort extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            swaps: [],
        };
    }

    // rewrite as the result of rewriting doAlgorithm
    componentDidMount = () => {
        if (this.props.algorSteps.steps.length === 0) {
            this.doAlgorithm();
        }
    };

    // slightly different from the prototype: update swap count after receiving
    // response from backend
    doAlgorithm = async () => {
        this.props.doPause();
        let array = this.props.array.map((o) => o.value);
        let data = { array: array };

        let response = await AlgoFetcher.post(this.props.algorithmUrl, data);
        // update swap
        let c = 0;
        let s = [];
        for (let i = 0; i < response.data.result.steps.length; i++) {
            c += response.data.result.steps[i].swapped ? 1 : 0;
            s.push(c);
        }
        s[-1] = 0;
        this.setState({ swaps: s });
        this.props.setStateFromChild({
            algorSteps: response.data.result,
            currentStep: 0,
        });
    };

    drawBlocks = () => {
        // when page loaded at first or in case steps are missing
        if (
            this.props.algorSteps.steps.length === 0 ||
            this.props.currentStep === 0
        ) {
            return this.props.array.map((v) => {
                return (
                    <td
                        className={"value-block"}
                        key={v.id}
                        id={v.id}
                        onClick={this.props.updateTargetBoxValue.bind(this)}
                    >
                        {v.value}
                    </td>
                );
            });
        } else {
            var steps = this.props.algorSteps.steps;
            var currentStep = this.props.currentStep - 1;
            var array = steps[currentStep].array; // array of indexes
            var highlight = steps[currentStep].highlight;
            var swapped = steps[currentStep].swapped;
            var sorted = steps[currentStep].sorted;

            return array.map((v) => {
                var style = "";

                if (highlight.includes(v)) {
                    style = swapped ? " highlight-error" : " highlight";
                } else if (sorted.includes(v)) {
                    style = " highlight-success";
                } else {
                    style = " highlight-domain";
                }

                return (
                    <td
                        className={"value-block" + style}
                        key={v}
                        id={v}
                        onClick={this.props.updateTargetBoxValue.bind(this)}
                    >
                        {this.props.array[v].value}
                    </td>
                );
            });
        }
    };

    render = () => {
        return (
            <div className="content">
                <div className="centered">
                    <h2>Insertion Sort</h2>
                </div>
                {/*
                <div className="info">
                    <button className="btn">Extra Info right here</button>
                </div>
                */}

                {/*
                <svg ref={this.boardRef} className="board" width={this.state.width} height={this.state.height}>
                    USE SVG FOR MORE ADVANCED ANIMATIONS IN THE FUTURE
                </svg>
                */}
                <Array1D
                    boardRef={this.props.boardRef}
                    drawBlocks={this.drawBlocks}
                />

                <div className="input-container hidden">
                    <input
                        ref={this.props.inputRef}
                        className="num-input"
                        type="number"
                        placeholder="Search for"
                        defaultValue={this.props.array[12].value}
                    ></input>
                </div>

                <div className="swap-counter-container">
                    <span>
                        {" "}
                        Swaps: {
                            this.state.swaps[this.props.currentStep - 1]
                        }{" "}
                    </span>
                </div>

                <StepTracker
                    algorSteps={this.props.algorSteps}
                    currentStep={this.props.currentStep}
                ></StepTracker>

                <Controls
                    doAlgorithm={this.doAlgorithm}
                    doPause={this.props.doPause}
                    doPlay={this.props.doPlay}
                    stepBackward={this.props.stepBackward}
                    stepForward={this.props.stepForward}
                    doReset={this.props.doReset}
                    updateSpeed={this.props.updateSpeed}
                    playing={this.props.playing}
                ></Controls>
            </div>
        );
    };
}

export default algorithmPages(InsertionSort, "sorts/insertionsort/");
