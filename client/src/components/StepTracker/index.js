import React, { Component } from "react";
import "./StepTracker.css";

class StepTracker extends Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    render = () => {
        // scroll the console to the right step
        if (this.ref.current) {
            this.ref.current.scrollTop = (this.props.currentStep - 4) * 24;
        }

        return (
            <div className="step-tracker-container">
                <span>
                    Current step: <b>{this.props.currentStep}</b>/
                    {this.props.algorSteps.steps.length
                        ? this.props.algorSteps.steps.length
                        : 0}
                </span>
                <div ref={this.ref} className="console">
                    {this.props.algorSteps.steps.map((e, i) => {
                        // string to return
                        let s =
                            `${i + 1}`.padStart(4, " ") +
                            `. ${e.description} \n`;
                        // mark and bold the line if it is the current step
                        if (this.props.currentStep === i + 1) {
                            s = <b>{" > " + s}</b>;
                        } else {
                            s = "   " + s;
                        }
                        return s;
                    })}
                </div>
            </div>
        );
    };
}

export default StepTracker;
