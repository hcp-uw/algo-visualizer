import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./BinarySearch.css";
import Controls from "../../components/Controls";
import algorithmPages from "../algorithmPages";
import Array1D from "../../components/Array1D";
import StepTracker from "../../components/StepTracker";

class BinarySearch extends React.Component {
    drawBlocks = () => {
        var steps = this.props.algorSteps.steps;
        var currentStep = this.props.currentStep - 1;
        var currentHighlightId = steps[currentStep]
            ? steps[currentStep].step
            : undefined;
        return this.props.array.map((v) => {
            var style = "";
            if (currentHighlightId !== undefined) {
                if (
                    v.id >= steps[currentStep].l &&
                    v.id <= steps[currentStep].r
                ) {
                    style = " highlight-domain ";
                }
                if (currentHighlightId === v.id) {
                    style = " highlight";
                } else if (
                    currentStep !== 0 &&
                    v.id === steps[currentStep - 1].step &&
                    currentHighlightId === -1
                ) {
                    style = this.props.algorSteps.success
                        ? " highlight-success"
                        : " highlight-error";
                }
            }

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
                    <h2>Binary Search</h2>
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

export default algorithmPages(BinarySearch, "searches/binarysearch/");
