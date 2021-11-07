import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Array from './Array';

// import React from 'react';
// import ReactDOM, { render } from 'react-dom';
import Canvas from './Canvas';

class Page extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      // array must have at least one value
      arr: [121, 122, 123, 124, 125, 126, 127, 128, 129, 130]
    };
    // create reference for the Array child component
    this.arrayElement = React.createRef(); 
  }

  handleNextClick = ()=>  {
    this.arrayElement.current.stepForward();
  }

  handlePreviousClick = ()=> {
    this.arrayElement.current.stepBackward();
  }


  render(){
   return (
    <div>
        <h1> Linear Search</h1>
        <Array ref={this.arrayElement} arr ={this.state.arr}/>
        <div>        
          <button onClick={this.handlePreviousClick}>previous</button>
          <button onClick={this.handleNextClick}>next</button>
        
        </div>

    </div>
   );
  }
}

ReactDOM.render(<Page/>, document.getElementById('root'));  


