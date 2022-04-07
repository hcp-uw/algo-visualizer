import React, { Component } from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import 'bootstrap/dist/css/bootstrap.css'
import './Controls.css'

class Controls extends Component {
    render = () => {
        return (
            <React.Fragment>
                <div className='centered'>
                    <span >
                        Current step: <b>{this.props.currentStep}</b>/
                        {this.props.algorSteps.steps.length ? this.props.algorSteps.steps.length : 0}
                    </span>
                    <div>
                        <label htmlFor="speed-slider">Speed:&nbsp;</label>
                        <input id="speed-slider" type="range" min="1" max="10" defaultValue={5} onChange={(e) => this.props.updateSpeed(e.target.value)}></input>
                    </div>
                    <div className="controls">
                        <button className="btn" title="do algorithm" onClick={this.props.doAlgorithm}>
                            <span>Build</span>
                            <FontAwesomeIcon icon="fa-wrench" className="fa"/>                
                        </button>
                        {
                            this.props.playing ? 
                            (<button className="btn" onClick={this.props.doPause}>
                                <span>Pause</span>
                                <FontAwesomeIcon icon="fa-pause" className="fa"/>                
                            </button>) :
                            (<button className="btn" onClick={this.props.doPlay}>
                                <span>Play</span>
                                <FontAwesomeIcon icon="fa-play" className="fa"/>                
                            </button>)
                        }
                        <button className="btn" title="step backward once" onClick={this.props.stepBackward}>
                            <span>Backward</span>
                            <FontAwesomeIcon icon="fa-backward-step" className="fa"/>                
                        </button>
                        <button className="btn" title="step forward once" onClick={this.props.stepForward}>
                            <span>Forward</span>
                            <FontAwesomeIcon icon="fa-forward-step" className="fa"/>                
                        </button>
                        <button className="btn" title="restart algorithm" onClick={this.props.doReset}>
                            <span>Reset</span>
                            <FontAwesomeIcon icon="fa-rotate-left" className="fa"/>                
                        </button>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Controls;