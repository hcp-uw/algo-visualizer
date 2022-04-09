import React from 'react'
import axios from 'axios'
import './common.css'

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
                width: props.width,
                height: props.height,
                array: [],
                algorSteps: { steps: [], success: false},
                currentStep: 0,
                playSpeed: 5,
                playing: false
            }
    
            var rands = [];
            while (rands.length < 15) {
                var n = Math.floor(Math.random() * 100);
                rands.push(n);
            }
            if (props.sort)
                rands.sort( (a,b) => a - b);
    
            for (var i = 0; i < 15; i++) {
                this.state.array.push({id:i, value:rands[i]})
            }
        }

        // step forward the algorithm, use for button
        stepForward = () => {
            this.setState({ currentStep : Math.min(this.state.currentStep+1, this.state.algorSteps.steps.length) });
            this.doPause();
        }
        
        // step backward the algorithm
        stepBackward = () => {
            this.setState({ currentStep: Math.max(this.state.currentStep-1, 0) });
            this.doPause();
        }
        
        // draw the individual blocks of the array
        drawBlocks = () => {
            var currentHighlightId = this.state.algorSteps.steps[this.state.currentStep-1];
            return this.state.array.map(
                v => {
                    var style = '';
                    if (currentHighlightId === v.id) {
                        style = ' highlight';
                    } else if (v.id === this.state.algorSteps.steps[this.state.currentStep-2] 
                        && currentHighlightId === -1) {
                        style = this.state.algorSteps.success ? ' highlight-success' : ' highlight-error';
                    }
                    
                    return <td 
                        className={"value-block" + style} 
                        key={v.id} 
                        id={v.id}
                        onClick={this.updateTargetBoxValue.bind(this)}
                        >{v.value}</td>
                });
        }
        
        // request the backend to perform the algorithm
        doAlgorithm = () => {
            this.doPause();
            var input = parseInt(this.inputRef.current.value);
            var array = this.state.array.map((o)=> o.value);
            var data = { array: array, target: input };
            axios.post(algorithmUrl, data)
                .then( (res) => {
                this.setState( { algorSteps: res.data.result, currentStep: 0 });
            });
        }
        
        // reset the current step back to 0
        doReset = () => {
            this.setState({ currentStep: 0});
            this.doPause();
        }
        
        // start playing the algorithm
        doPlay = () => {
            this.doPause();
            // restart the current step if the user press play at last step
            if (this.state.currentStep === this.state.algorSteps.steps.length) {
                this.setState( { currentStep: 0} );
            }

            if (this.state.currentStep < this.state.algorSteps.steps.length) {
                this.playStepLoop();
            }
        }
        
        // step the algorithm once and reestablish the timer loop
        playStepLoop = () => {
            if (this.state.currentStep === this.state.algorSteps.steps.length) {
                this.doPause();
            } else {
                this.stepForward();
                var interval = 7500 / Math.sqrt(Math.pow(Math.E, this.state.playSpeed));
                this.playTimer = setTimeout(this.playStepLoop, interval);
                this.setState( { playing: true } );
            }
        }
        
        // pause the algorithm if running
        doPause = () => {
            if (this.playTimer) {
                window.clearTimeout(this.playTimer);
                this.playTimer = undefined;
                this.setState( { playing: false } );
            }
        }
        
        // after all component are ready at the beginning of loading the page,
        // do the algorithm once
        componentDidMount = () => {
            if (this.state.algorSteps.steps.length === 0) {
                this.doAlgorithm();
            }
        }
        
        // update speed
        updateSpeed = (speed) => {
            this.setState( { playSpeed: speed } );
        }

        // update target box
        // DOES NOT UPDATE INTERNAL TARGET VALUE
        updateTargetBoxValue = (e) => {
            this.inputRef.current.value = e.target.innerHTML;
        }

        // cheat
        setStateFromChild = (state) => {
            this.setState(state);
        }

        render = () => {
            return <React.Fragment>
                <OriginalPage 
                    stepForward={this.stepForward}
                    stepBackward={this.stepBackward}
                    drawBlocks={this.drawBlocks}
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
                    { ... this.state}
                    { ... this.props}
                />
                </React.Fragment>;
        }
    }

    return AlgorithmPages;
}

export default algorithmPages;