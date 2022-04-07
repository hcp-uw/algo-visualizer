import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import './LinearSearch.css'
import Controls from '../../components/Controls'
import algorithmPages from '../algorithmPages'
import Array1D from '../../components/Array1D'

class LinearSearch extends React.Component {
    render = (props) => {
        return (
            <div className="content">
                <div className="centered">
                    <h2>Linear Search</h2>
                </div>
                <div className="info">
                    <button className="btn">Extra Info right here</button>
                </div>
                
                <Array1D 
                    boardRef={this.props.boardRef}
                    drawBlocks={this.props.drawBlocks}
                />
                {/*
                <svg ref={this.boardRef} className="board" width={this.state.width} height={this.state.height}>
                    USE SVG FOR MORE ADVANCED ANIMATIONS IN THE FUTURE
                </svg>
                */}
                

                <div className='input-container'>
                    <input ref={this.props.inputRef} className="num-input" type="number" placeholder="Search for" defaultValue={this.props.array[12].value}></input>
                </div>

                <Controls
                    doAlgorithm={this.props.doAlgorithm}
                    doPause={this.props.doPause}
                    doPlay={this.props.doPlay}
                    stepBackward={this.props.stepBackward}
                    stepForward={this.props.stepForward}
                    doReset={this.props.doReset}
                    updateSpeed={this.props.updateSpeed}
                    algorSteps={this.props.algorSteps}
                    playing={this.props.playing}
                    currentStep={this.props.currentStep}
                >
                </Controls>
            </div>
        );
    }
}

export default algorithmPages(LinearSearch, "http://localhost:3001/searches/linearsearch/");