# Technologies

These are the tech concepts that AlgoViz uses:

## 1. React

yes

## 2. React hooks

3 important hooks to understand:

-   useState: create state for a component
-   useRef: create reference to an HTML element
-   useEffect: handle when 1) component first mounted 2) specific states change 3) component unmounted

## 3. Redux Toolkit

[tutorial](https://www.youtube.com/watch?v=iBUJVy8phqw)

Redux Toolkit is a simpler version of Redux. We just need some simple form of global states.

## 4. React Query

[tutorial](https://www.youtube.com/playlist?list=PLC3y8-rFHvwjTELCrPrcZlo6blLBUspd2)

React Query handles API caching, rate limiting, asynchronous success/error... for smoother API call/update.
For AlgoViz react query is used to handle api calls to the backend.

## 5. Typescript

Typescript enforces variable type consistency and doesn't actually change how Javascript function.
Makes understanding the codebase and scaling way easier.

## 6. SaSS

[summary](https://www.youtube.com/watch?v=akDIJa0AP5c) [tutorial](https://www.youtube.com/watch?v=nu5mdN2JIwM)

Syntatically similar to vanilla CSS but allows nesting definition and function/method for code reuse.

## 7. CSS Animation

[quick tutorial](https://www.youtube.com/watch?v=YszONjKpgg4)

Important CSS properties to make animations:

-   transition
-   transform: translate, scale, rotate
-   animation keyframes

Extra: SVG

AlgoViz uses CSS animation everywhere: button glowing, highlights, array blocks moving, logo animation...

## 8. React Toastify

[docs](https://fkhadra.github.io/react-toastify/introduction/)

For simple side notifications.

## 9. FontAwesome

Free icons!

TLDR of workflow:

-   Find icons at the [icon library](https://fontawesome.com/icons)
-   Add icon to library in `App.tsx`
-   Use icon in any other components with FontAwesomeIcon

## 10. Bootstrap for React

[docs](https://react-bootstrap.github.io/components/alerts)

Use for some components like the Navbar, Popovers...

## 11. Postgres

Handle user feedback.

# Functionalities

## 1. Pages

Since AlgoViz uses React, it is a single page application, meaning the entire application is just 1 index page. When access other "pages", the index page renders different component. So pages are just React components.

The index page in essence consists of the Navbar and an Algorithm Component such as `BinarySearch` or `InsertionSort`, all located in the `pages` folder.

The component `App` can be thought like the root of the application that the index page loads.

Settings and routing are handled in either `App.tsx` or `index.js`.

## 2. State Management

AlgoViz's global states are organized into two slices:

-   "state": for general states of the current algorithm. Logics are defined in `stateSlice.ts`.
-   "inputState": for saving previous input fields. Logics are defined in `inputStateSlice.ts`.

## 3. AlgorithmPopover

AlgorithmPopover (AlgorithmDescription) is an icon that when clicked will show a modal with more information about the current algorithm.

Props:

```
data:object = {
	algorithm: string;      # name of algorithm
	title: string;          # short description
	description: string;    # time/space complexity
}
```

Information of all algorithms are recorded within `assets/algorithm-information.js`. The Page is responsible for importing and providing the correct description.

## 4. VisualizerContainer

VisualizerContainer wraps around another visual components (Array1D, Graph) and provides the ability to zoom/pan the child component.

Props:

```
scale: number (1 += SCALE_LIMIT)
```

Constants:

```
SCALE_LIMIT: 0.5
```

Current features:

-   Reset to default position. NOTE: the current implementation to reset position is to unmount and remount the child component. This works fine for component that doesn't have local states like Array1D, but problematic for Graph.
-   Pan by dragging. Utilize React Draggable library.
-   Zoom,
-   Lock zoom/pan.

The implementation for this compoment is messy:

-   Draggable is buggy if wraps around another Draggable. Scale state is shared with the child component.
-   To make the the child component draggable even when not hovered directly, the child is wrapped by a div with 500% width and 5000% height, and another div for position centering.
    The potential fix is to manually implement the Draggable library to fit for AlgoViz.

## 5. Array1D

Handles the display of the a 1D array. Doesn't hold the content of the array itself.

Props:

```
drawBlocks: function
```

`drawBlocks` is a function defined by the Page since each algorithm require different mode of display. The available styles are still defined in `Array1D.css`, but which array block to apply these styles is the responsibility of the Page.

## 6. Graph

Graph is an interactive component that display and allow graph edits. DOES HOLD the content of the graph unlike Array1D.

Currently it can handle undirected weighed/non-weighed graphs.

Features:

-   Create node: double left click
-   Delete node: single right click, will delete any edge associates with it
-   Create edge: left click on two nodes
-   Change edge weight: double click on the edge
-   Delete edge: single right click on the edge
-   Draggable nodes.

Each node are named by the order they were created.

## 7. Controls (component)

Controls is a very large component that handles the following:

-   Algorithm progress controllers:
    -   Play: automatically progress the algorithm
    -   Pause: stop automatically progressing the algorithm.
    -   Forward: move the algorithm forward by 1 step
    -   Backward: move the algorithm backward by 1 step
    -   Reset: set the algorithm step to 0
    -   Speed slider: change the speed of auto progress
-   Step progress bar: display the current step of the algorithm. Click on the bar to jump to certain steps.
-   Inputs: currently can optionally contain a `SingleInput` and an `ArrayInput`
-   Fetch algorithm button: send a request to to fetch the algorithm using the current inputs.
-   Display current search target (linear/binary search) and swap/compare counts (sort algorithms).

Controls component detects when there is a change in array/graph input (by comparing the current input with previous ones in global state) and spawns a toast + glowing animation around the fetch algorithm button. This feature was the initial cause of how intertwined the Controls compoenet is,however it is modulable by handling states differently.

Props:

```
extraData?:object = {
	key: "swap" | "compares" | "target";
	data: any;
	updater: function;
}
require?: string[] ("arrayInput" | "singleInput" | "graphInput")
requestSortedArray: boolean
algorithmUrl: string
```

-   `extraData` (optional): defines if the controls is displaying current search target or swap/compare counts. `data` is the local state passed from the Page and the `updater` is to update this state.
-   `require` (optional): defines the type of input that the Controls will hold/render. Can handle multiple type of inputs but not multiple of the same type.
-   `requestSortedArray` (optional): a boolean for random array generator to know if it should make a sorted array. Use primarily for Binary Search.
-   `algorithmUrl`: the backend API URL to fetch algorithm.
