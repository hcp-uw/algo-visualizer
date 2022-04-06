import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import './LinearSearch.css'
import Controls from '../../components/Controls'
import axios from 'axios'

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
        var array = this.state.array.map((o)=> o.value);
        var data = { array: array, target: input };
        axios.post("http://localhost:3001/searches/linearsearch/", data)
            .then( (res) => {
                this.setState( { algorSteps: res.data.result, currentStep: 0 });
            });
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

    updateSpeed = (speed) =>{
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

                <Controls
                    doAlgorithm={this.doAlgorithm}
                    doPause={this.doPause}
                    doPlay={this.doPlay}
                    stepBackward={this.stepBackward}
                    stepForward={this.stepForward}
                    doReset={this.doReset}
                    updateSpeed={this.updateSpeed}
                    algorSteps={this.state.algorSteps}
                    playing={this.state.playing}
                    currentStep={this.state.currentStep}
                >
                </Controls>
            </div>
        );
    }
}

export default LinearSearch;