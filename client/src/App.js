import React from "react";
import "./App.css";
import NavBar from "./components/NavBar/";

// for icons
import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faPlay,
    faForwardStep,
    faBackwardStep,
    faRotateLeft,
    faPause,
    faWrench,
    faArrowsRotate,
} from "@fortawesome/free-solid-svg-icons";

import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LinearSearch from "./pages/LinearSearch";
import BinarySearch from "./pages/BinarySearch";
import BubbleSort from "./pages/BubbleSort";
import InsertionSort from "./pages/InsertionSort";
import SelectionSort from "./pages/SelectionSort";

// necesary step to use these icons on other components
library.add(
    faPlay,
    faForwardStep,
    faBackwardStep,
    faRotateLeft,
    faPause,
    faWrench,
    faArrowsRotate
);

const App = () => {
    return (
        <React.Fragment>
            <NavBar />
            {/* These determines the page hrefs for the app */}
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route
                    exact
                    path="/linear-search"
                    element={<LinearSearch sort={true} />}
                />
                <Route
                    exact
                    path="/binary-search"
                    element={<BinarySearch sort={true} />}
                />
                <Route exact path="/bubble-sort" element={<BubbleSort />} />
                <Route
                    exact
                    path="/insertion-sort"
                    element={<InsertionSort />}
                />
                <Route
                    exact
                    path="/selection-sort"
                    element={<SelectionSort />}
                />
            </Routes>
        </React.Fragment>
    );
};

export default App;
