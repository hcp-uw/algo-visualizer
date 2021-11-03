import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// import React from 'react';
// import ReactDOM, { render } from 'react-dom';
import Canvas from './Canvas';

class Page extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      text: 'click on either button', 
      arr: [1, 2, 3, 4, 5, 6, 7, 8] // array length must be greater than 1
    };
  }

  handlePreviousClick = ()=> {
    this.setState({
      text: 'you clicked on Previous button'
    });
  }

  handleNextClick = ()=>  {
    this.setState({
      text: 'you clicked on Next button'
    });
  }

  render(){
   return (
    <div>
        <div>
          <Canvas width ={830} height={600} arr={this.state.arr}/>
        </div>
        <div>        
          <button onClick={this.handlePreviousClick}>previous</button>
          <button onClick={this.handleNextClick}>next</button>
          <p>{this.state.text}</p> 
        </div>

    </div>
   );
  }
}

ReactDOM.render(<Page />, document.getElementById('root'));  


