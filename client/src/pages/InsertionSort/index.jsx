import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./InsertionSort.css";
import Controls from "../../components/Controls";
import algorithmPages from "../algorithmPages";
import Array1D from "../../components/Array1D";
import AlgoFetcher from "../../apis/AlgoFetcher";
import StepTracker from "../../components/StepTracker";
import { animated, Transition } from "react-spring";

class InsertionSort extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // swaps[i] is the boolean if a swap is happening at step i
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
            prevStep: -1,
        });
    };

    /**
     * Check the drawBlocks() function on algorithmPages.js for general info.
     *
     * For insertion sort, each step includes the following:
     *
     * this.props.algorSteps.steps[i] =
     *                          {
     *                              array(Array): array of indexes. the state of the entire array at the ith step
     *                              highlight(Array): the indexes of elements that are currently focused
     *                              sorted(Array): the indexes of elements that are sorted
     *                              swapped(Bool): mark if the ith step is swapping two elements
     *                              swapCount(Number): the count of total swaps up to step ith
     *                          }
     *
     * @returns react components
     */
    drawBlocks = () => {
        // when page loaded at first or in case steps are missing
        let isStepAvailable =
            this.props.algorSteps.steps.length > 0 &&
            this.props.currentStep > 0;
        if (isStepAvailable) {
            var steps = this.props.algorSteps.steps;
            var currentStep = this.props.currentStep - 1;
            var array = steps[currentStep].array;
            var highlight = steps[currentStep].highlight;
            var swapped = steps[currentStep].swapped;
            var sorted = steps[currentStep].sorted;
        } else {
            // default array from contianing numbers from 0 to 14
            array = [...Array(15).keys()];
        }
        // for each element in the array at the current step
        return this.props.array.map((v, i) => {
            var style = "";
            if (isStepAvailable) {
                if (highlight.includes(i)) {
                    style = swapped ? " highlight-error" : " highlight";
                } else if (sorted.includes(i)) {
                    style = " highlight-success";
                } else {
                    style = " highlight-domain";
                }
            }
            let m = array.indexOf(i) - i;
            let prev =
                isStepAvailable && this.props.prevStep - 1 >= 0
                    ? steps[this.props.prevStep - 1].array.indexOf(i) - i
                    : 0;

            return (
                <Transition
                    items={v}
                    // default value is 170/26
                    config={{
                        tension: 170 * 1.5,
                        friction: 26,
                    }}
                    enter={{ transform: prev }}
                    update={{ transform: m }}
                    key={"t" + i * i}
                >
                    {({ transform }) => {
                        return (
                            <animated.td
                                className={"value-block" + style}
                                key={i}
                                id={i}
                                style={{
                                    transform: transform
                                        .to({
                                            range: [prev, m],
                                            output: [prev * 58, m * 58],
                                        })
                                        .to((x) => `translate3d(${x}px, 0, 0)`),
                                }}
                            >
                                {v.value}
                            </animated.td>
                        );
                    }}
                </Transition>
            );
        });
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

                {
                    // The input box is hidden, will break the app if removed because the functions in
                    // the prototype is referencing this element. Could find a fix somehow.
                }
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
                        Swaps: {this.state.swaps[this.props.currentStep - 1]}
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
