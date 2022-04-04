import React from 'react';
import './App.css';
import NavBar from "./components/NavBar/"
import Canvas from "./components/Canvas"

// for icons
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlay, faForwardStep, faBackwardStep, faRotateLeft, faPause, faWrench } from '@fortawesome/free-solid-svg-icons'
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import LinearSearch from './pages/LinearSearch';
import BinarySearch from './pages/BinarySearch';

library.add(faPlay, faForwardStep, faBackwardStep, faRotateLeft, faPause, faWrench)

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <NavBar />
        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route exact path="/linear-search" element={<LinearSearch/>} />
          <Route exact path="/binary-search" element={<BinarySearch/>} />
        </Routes>
      </React.Fragment>
    );
  }
}

export default App;
