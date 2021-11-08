import React from 'react';
import './Array.css';

class Array extends React.Component{
    constructor(props){
        super(props);
        this.canvasRef = React.createRef();
        this.state = {
                arr: props.arr,
                pivot: 0 
        };
    }

    stepForward = ()=>{
        let newPivot = (this.state.pivot + 1)%this.state.arr.length;
        this.setState({
          pivot: newPivot
        });
    }

    stepBackward = ()=>{
        let newPivot = this.state.pivot - 1;
        if(newPivot < 0){
          newPivot = this.state.arr.length-1;
        }
    
        this.setState({
          pivot: newPivot
        });
    }

    render(){
        // console.log("Array Component: " + this.state.pivot);
        let jsxArr = [];
        let jsxValues = [];
        for(let i=0; i<this.state.arr.length; i++){
            if(i === this.state.pivot){
                // use different sytling for pivot
                jsxArr.push(<div className="arrayPivot"></div> );
            }else{
                jsxArr.push(<div className="array"></div> );
            }
            
            jsxValues.push( <div className="values">{this.state.arr[i]}</div>);
        }
        return (
            <div>
                <div>
                  {jsxArr}
                </div>
                <div>
                   {jsxValues}
                </div>
            </div>
        );
    }
}

export default Array;