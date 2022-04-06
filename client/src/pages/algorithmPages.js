import React from 'react'
import axios from 'axios'

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
                playSpeed: 3,
                playing: false
            }
    
            var rands = [];
            while (rands.length < 10) {
                var n = Math.floor(Math.random() * 100);
                rands.push(n);
            }
            rands.sort( (a,b) => a - b);
    
            for (var i = 0; i < 10; i++) {
                this.state.array.push({id:i, value:rands[i]})
            }
        }

        // step forward the algorithm
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
                        style = this.state.algorSteps.success ? ' highlight-found' : ' highlight-error';
                    }
                    
                    return <td className={"value-block" + style} key={v.id} id={v.id}>{v.value}</td>
                })
        }
        
        // request the backend to perform the algorithm
        doAlgorithm = () => {
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
        
        // play the algorithm steps
        doPlay = () => {
            this.doPause();
    
            if (this.state.currentStep < this.state.algorSteps.steps.length) {
                this.stepForward();
                var interval = 10000 / Math.pow(Math.E, this.state.playSpeed);
                this.playTimer = setTimeout(this.doPlay, interval);
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
                    inputRef={this.inputRef}
                    boardRef={this.boardRef}
                    { ... this.state}
                    { ... this.props}
                />
                </React.Fragment>;
        }
    }

    return AlgorithmPages;
}

export default algorithmPages;