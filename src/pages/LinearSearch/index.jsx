import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import './LinearSearch.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {linearSearch} from '../../algorithms/searches.js'

class LinearSearch extends React.Component {
    constructor(props) {
        super(props);
        this.boardRef = React.createRef();
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

    stepForward = () => {
        this.setState({ currentStep : Math.min(this.state.currentStep+1, this.state.algorSteps.steps.length) });
        this.doPause();
    }

    stepBackward = () => {
        this.setState({ currentStep: Math.max(this.state.currentStep-1, 0) });
        this.doPause();
    }

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

    doAlgorithm = () => {
        var input = parseInt(this.inputRef.current.value);
        var algorithm = linearSearch;
        var array = this.state.array.map((o)=> o.value);
        
        this.setState( { algorSteps: algorithm(array, input), currentStep: 0 });
    }

    doReset = () => {
        this.setState({ currentStep: 0});
        this.doPause();
    }

    doPlay = () => {
        this.doPause();

        if (this.state.currentStep < this.state.algorSteps.steps.length) {
            this.stepForward();
            var interval = 10000 / Math.pow(Math.E, this.state.playSpeed);
            this.playTimer = setTimeout(this.doPlay, interval);
            this.setState( { playing: true } );
        }
    }

    doPause = () => {
        if (this.playTimer) {
            window.clearTimeout(this.playTimer);
            this.playTimer = undefined;
            this.setState( { playing: false } );
        }
    }

    componentDidMount = () => {
        if (this.state.algorSteps.steps.length === 0) {
            this.doAlgorithm();
        }
    }

    updateSpeed(speed) {
        this.setState( { playSpeed: speed } );
    }

    render = (props) => {
        return (
            <div className="content">
                <div className="info">
                    <button className="btn">Extra Info right here</button>
                </div>
                
                {/*
                <svg ref={this.boardRef} className="board" width={this.state.width} height={this.state.height}>
                    USE SVG FOR MORE ADVANCED ANIMATIONS IN THE FUTURE
                </svg>
                */}
                <div className='table-container'>
                    <table ref={this.boardRef} className="elements">
                            <tbody>
                                <tr className="value-row">
                                    <td></td>
                                    {this.drawBlocks()}
                                </tr>
                                <tr className="index-row">
                                    <td >Index</td>
                                    {[...Array(10).keys()].map(v => <td key={v*Math.random()}>{v}</td>)}
                                </tr>
                            </tbody>
                    </table>
                </div>

                <div className='input-container'>
                    <input ref={this.inputRef} className="num-input" type="number" placeholder="Search for" defaultValue={this.state.array[6].value}></input>
                </div>

                <div className='centered'>
                    <span >
                        Current step: <b>{this.state.currentStep}</b>/
                        {this.state.algorSteps.steps.length ? this.state.algorSteps.steps.length : 0}
                    </span>
                    <div>
                        <label htmlFor="speed-slider">Speed:&nbsp;</label>
                        <input id="speed-slider" type="range" min="1" max="5" defaultValue={this.state.playSpeed} onChange={(e) => this.updateSpeed(e.target.value)}></input>
                    </div>
                </div>

                <div className='controls'>
                    <button className="btn" title="do algorithm" onClick={this.doAlgorithm}>
                        <span>Build</span>
                        <FontAwesomeIcon icon="fa-wrench" className="fa"/>                
                    </button>
                    {
                        this.state.playing ? 
                        (<button className="btn" onClick={this.doPause}>
                            <span>Pause</span>
                            <FontAwesomeIcon icon="fa-pause" className="fa"/>                
                        </button>) :
                        (<button className="btn" onClick={this.doPlay}>
                            <span>Play</span>
                            <FontAwesomeIcon icon="fa-play" className="fa"/>                
                        </button>)
                    }
                    <button className="btn" title="step backward once" onClick={this.stepBackward}>
                        <span>Backward</span>
                        <FontAwesomeIcon icon="fa-backward-step" className="fa"/>                
                    </button>
                    <button className="btn" title="step forward once" onClick={this.stepForward}>
                        <span>Forward</span>
                        <FontAwesomeIcon icon="fa-forward-step" className="fa"/>                
                    </button>
                    <button className="btn" title="restart algorithm" onClick={this.doReset}>
                        <span>Reset</span>
                        <FontAwesomeIcon icon="fa-rotate-left" className="fa"/>                
                    </button>
                </div>
            </div>
        );
    }
}

export default LinearSearch;