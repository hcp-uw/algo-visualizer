import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./LinearSearch.css";
import Controls from "../../components/Controls";
import algorithmPages from "../algorithmPages";
import Array1D from "../../components/Array1D";
import StepTracker from "../../components/StepTracker";

class LinearSearch extends React.Component {
    /**
     * Check the drawBlocks() function on algorithmPages.js for general info.
     *
     * For linear search, each step just include the index of focused element.
     *
     * this.props.algorSteps.steps[i] =
     *                          {
     *                              step: index of focused element at step i
     *                          }
     *
     * @returns react components
     */
    drawBlocks = () => {
        // react can try to render before the backend return the steps (when page first loaded)
        // so a guard is necessary
        var currentHighlightId =
            this.props.algorSteps.steps.length > 0 && this.props.currentStep > 0
                ? this.props.algorSteps.steps[this.props.currentStep - 1]
                      .element
                : undefined;
        // for each element in the array
        return this.props.array.map((v) => {
            // first decide the highlight style for the element
            var style = "";
            // undefined guard
            if (currentHighlightId !== undefined) {
                // highlight if the current element is focused
                if (currentHighlightId === v.id) {
                    style = " highlight";
                }
                // else if we reach the end of search (marked as -1)
                else if (
                    currentHighlightId === -1 &&
                    v.id ===
                        this.props.algorSteps.steps[this.props.currentStep - 2]
                            .element
                ) {
                    style = this.props.algorSteps.success
                        ? " highlight-success"
                        : " highlight-error";
                }
            }
            // return a react component
            return (
                <td
                    className={"value-block" + style}
                    key={v.id}
                    id={v.id}
                    onClick={this.props.updateTargetBoxValue.bind(this)}
                >
                    {v.value}
                </td>
            );
        });
    };

    render = () => {
        return (
            <div className="content">
                <div className="centered">
                    <h2>Linear Search</h2>
                </div>
                {/*
                <div className="info">
                    <button className="btn">Extra Info right here</button>
                </div>
                */}

                <Array1D
                    boardRef={this.props.boardRef}
                    drawBlocks={this.drawBlocks}
                />
                {/*
                <svg ref={this.boardRef} className="board" width={this.state.width} height={this.state.height}>
                    USE SVG FOR MORE ADVANCED ANIMATIONS IN THE FUTURE
                </svg>
                */}

                <StepTracker
                    algorSteps={this.props.algorSteps}
                    currentStep={this.props.currentStep}
                ></StepTracker>

                <div className="input-container">
                    <input
                        ref={this.props.inputRef}
                        className="num-input"
                        type="number"
                        placeholder="Search for"
                        defaultValue={this.props.array[12].value}
                    ></input>
                </div>

                <Controls
                    doAlgorithm={this.props.doAlgorithm}
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

export default algorithmPages(LinearSearch, "searches/linearsearch/");
