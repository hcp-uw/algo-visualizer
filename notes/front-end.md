# AlgoViz - Frontend

The frontend of AlgoViz is written in React framework, using React-Toolkit for state management and React-Spring for component animations.

## General Layout

<p align="center">
  <img src="https://i.imgur.com/usQQsVj.png" />
  <br>
  <span><i>Layout of AlgoViz</i></span>
</p>

The root layout of the application is defined in `App.js` and composed of two Components: `NavBar` and `Page`. The application routes to one of the components in `src/pages/` folder as the `Page`, eg. `localhost:3000/insertion-sort` will load `InsertionSort` component as the `Page`. Note that this pattern is of a single-page application, where different "pages" load different components to **the same page** on request through Javascript instead of fully requesting and loading new pages.

Each `Page` contains minor components that are useful for displaying the algorithm. For the example above of Insertion Sort, the page contains 3 components:

-   `Array1D`: renders the current array as a row of boxes.
-   `StepTracker`: contains the description of each algorithm step as well as highlighting the current step.
-   `Controls`: handles the interactive user actions that control the progress of the algorithm display.

All these components are located in the `src/components/` folder. The below graph shows the relationship between components in AlgoViz.

<p  align="center">
<img  alt="Component tree of AlgoViz"  title="Component tree of Algoviz" src="https://i.imgur.com/qEUHayw.png"/> 
<br>
<span><i>Component tree of AlgoViz</i></span>
</p>

## General patterns of components

### Pages

`Pages` are technically React Components. They are located in the `src/pages/` folder and decide how the content of the algorithm visualizer is rendered. Each `Page` must decide how the `Array1D` is rendered through the function `drawBlocks()` and can optionally alter the function of the Build button.

### Controls

`Controls` component handles the 5 buttons and a slider that the user can use to control the flow of the algorithm visualizer:

-   **_Build_**: use the current array and make a request to the server to perform the algorithm. After receiving a response, update the new data (algorithm steps) to global/local states. This function is automatically called once, after the `Controls` completes its first render.
-   **_Play_**: auto stepping forward the algorithm until it reaches the end. Pressing this button on the last step will reset the current step to 0.
-   **_Forward_**: increment the current step by 1.
-   **_Backward_**: decrement the current step by 1.
-   **_Reset_**: set the current step to 0.
-   **_Speed slider_**: set the play speed. Effective on the next play interval.

All the button functionalities are defined inside the `Controls` button. The Build button will use the function passed down from the parent `Page` if possible.

### Array1D

`Array1D` displays the array into a row of blocks. The `1D` is to separate it with future visual components. It uses `drawBlocks()` function to render the boxes, which is passed down from the parent `Page`. The `Array1D` itself doesn't determine how it is being rendered, but the stylings are defined here in the CSS file.

### StepTracker

The `StepTracker` displays the current step and total step as well as the description at each step.

In essence, the description box is a `<div>` containing all the step description strings, separated with whitespace and newline character. The CSS property `white-space: pre-wrap` makes this element respect the whitespace and newlines of strings. We highlight the current step description by making it bold (wrap a `<b>` around the string) and adding a `>`.

React Spring is used to handle the auto scroll to the current step. The line height is hardcoded to `24px`.

## State management

AlgoViz uses Redux Toolkit for global state management. For starters, [this](https://www.youtube.com/watch?v=iBUJVy8phqw) is a great tutorial. All the configurations for Redux are in the `src/redux/` folder.

<p align="center">
  <img src="https://i.imgur.com/FrKORfv.png" />
  <br>
  <span><i>configureStore.js</i></span>
</p>

`configureStore.js` sets up the global `store` object and reducers. Reducers are functions available to components for them to change the states. Here we import reducers from `stateSlice.js` as `global`.

A slice is a collection of states for a single feature in the application and the logic to update those states (reducers). At the moment, AlgoViz uses one slice named `state`, defined in `stateSlice.js`.

The global store should contain states common to all algorithms. At the moment, these states are `array, algorSteps, currentStep, prevStep`. Other states that only apply to certain algorithms (such as `swapCount` for sorts) should be localized at their respective `Page`.
