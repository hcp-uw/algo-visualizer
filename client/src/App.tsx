import React from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import { ErrorBoundary } from "react-error-boundary";

// for icons
import { IconDefinition, library } from "@fortawesome/fontawesome-svg-core";
import {
    faPlay,
    faForwardStep,
    faBackwardStep,
    faRotateLeft,
    faPause,
    faWrench,
    faArrowsRotate,
    faBug,
    faLock,
    faUnlock,
    faDownLeftAndUpRightToCenter,
    faMagnifyingGlassMinus,
    faMagnifyingGlassPlus,
    faCircleInfo,
    faShuffle,
    faTriangleExclamation,
    faThumbTack,
    faMeteor,
} from "@fortawesome/free-solid-svg-icons";

import { faGithub } from "@fortawesome/free-brands-svg-icons";

import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LinearSearch from "./pages/LinearSearch";
import BinarySearch from "./pages/BinarySearch";
import BubbleSort from "./pages/BubbleSort";
import InsertionSort from "./pages/InsertionSort";
import SelectionSort from "./pages/SelectionSort";
import MergeSort from "./pages/MergeSort";
import DepthFirstSearch from "./pages/DepthFirstSearch";
import BreadthFirstSearch from "./pages/BreadthFirstSearch";
import DjikstraSearch from "./pages/DjikstraSearch";
import PageErrorFallback from "./components/PageErrorFallback";
import AboutUs from "./pages/AboutUs"
import { createClient } from "contentful"

//import Test from "./pages/Test";

// necesary step to use these icons on other components
library.add(
    faPlay as IconDefinition,
    faForwardStep as IconDefinition,
    faBackwardStep as IconDefinition,
    faRotateLeft as IconDefinition,
    faPause as IconDefinition,
    faWrench as IconDefinition,
    faArrowsRotate as IconDefinition,
    faBug as IconDefinition,
    faLock as IconDefinition,
    faUnlock as IconDefinition,
    faDownLeftAndUpRightToCenter as IconDefinition,
    faMagnifyingGlassMinus as IconDefinition,
    faMagnifyingGlassPlus as IconDefinition,
    faCircleInfo as IconDefinition,
    faShuffle as IconDefinition,
    faTriangleExclamation as IconDefinition,
    faThumbTack as IconDefinition,
    faGithub as IconDefinition,
    faMeteor as IconDefinition
);

export const client = createClient({
    space: `${process.env.REACT_APP_SPACE_KEY}`,
    accessToken: `${process.env.REACT_APP_API_KEY}`,
    host: "preview.contentful.com"
})

const App = () => {
    return (
        <React.Fragment>
            <NavBar />
            {/* These determines the page hrefs for the app */}
            <ErrorBoundary
                onError={(error) => {
                    console.log("An error caused the page to crash:");
                    console.log(error);
                }}
                FallbackComponent={(error) => {
                    return <PageErrorFallback error={error} />;
                }}
            >
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/linear-search" element={<LinearSearch />} />
                    <Route path="/binary-search" element={<BinarySearch />} />
                    <Route path="/bubble-sort" element={<BubbleSort />} />
                    <Route path="/insertion-sort" element={<InsertionSort />} />
                    <Route path="/selection-sort" element={<SelectionSort />} />
                    <Route path="/merge-sort" element={<MergeSort />} />
                    <Route path="/depth-first-search" element={<DepthFirstSearch />} />
                    <Route path="/breadth-first-search" element={<BreadthFirstSearch />} />
                    <Route path="/djikstra-search" element={<DjikstraSearch />} />
                    <Route path="/about-us" element={<AboutUs />} />
                </Routes>
            </ErrorBoundary>
        </React.Fragment>
    );
};

export default App;
