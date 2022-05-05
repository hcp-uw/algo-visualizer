# Algorithm Visualizer - Code Refactor

Recently AlgoViz went front-end through a refactor where I converted all class components to functional ones. This post will explain my thought process for building the application (in the front-end only).

---

### tldr why I go on refactoring the codebase

On the verge of expanding the program, I saw a huge scalability problem with the application. These are the two main reasons:

-   The program was getting harder to maintain. Functions were not encapsulated in their components and moving data around the application takes too much work.
-   Popular libraries (Redux, react-spring) support functional components with hooks pattern way more than class components.

### The basics

I'll give a quick high-level review of the relevant information I think you should understand before explaining why I decided to refactor the codebase.

There are two types of [components](https://reactjs.org/docs/components-and-props.html) in React: class and functional components. Here is a React class component called `Example`.

```jsx
class Example extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			state1: 0,
			state2: {...},
			...
		}
		// more logic
	}

	classMethod1() {
		// changing state1 to 4
		this.setState( {state1: 4} );
	}

	classMethod2() {
		...
	}

	render() {
		return (<h1 prop1={...} prop2={...}>
			This is what getting rendered.
			This component has a state1={this.state.state1}
		</h1>);
	}
}
```

The above looks similar to a Java class that has a constructor with a few methods. React uses the `render()` method to determine what to render to the browser. In other words, the returned [JSX](https://reactjs.org/docs/introducing-jsx.html) component from the `render()` method represents the HTML DOM that React will process. React [state](https://reactjs.org/docs/state-and-lifecycle.html) is **local** to each component and persists throughout React [lifecycles](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/). You can think of it as the private fields of a class. States usually initialized as `this.state` in the constructor, and mutatable with the function `this.setState()` provided by React. Each time a state changes, every component that references this state is rerendered. Each component also receives a `props` (properties) object from the parent component on initialization.

This is the equivalent component to React as a function:

```jsx
function Example (props) {
	// states
	let [state1, setState1] = useState(null);
	let [state2, setState2] = useState(null);

	function classMethod1() {
		// changing state1 to 4
		setState1(4);
	}

	function classMethod2() {
		...
	}

	return (<h1 prop1={...} prop2={...}>
			This is what getting rendered.
			This component has a state1={state1}
		</h1>);
}
```

As you can see, functional components in general take less code to write. The function can directly have "class methods" in it and returns a JSX for React to render. The non-straight-forward part is that states do not make sense as "private fields" of a component in the context of a function (even though technically in Javascript a function is an object). This is where [React Hooks](https://reactjs.org/docs/hooks-overview.html) come into play. `useState` is a **Hook**, one of many built-in functions that allow you to access states without writing a class.

### How the application was built

AlgoViz was initially written in the class component pattern since I followed [this tutorial](https://www.youtube.com/watch?v=Ke90Tje7VS0) in the beginning of my React learning process 2 months ago. At the time I was unaware of React ecosystem and that functional component pattern with hooks is the norm for modern React.

<p align="center">
  <img alt="Interface of Algoviz" title="Interface of Algoviz" src="https://i.imgur.com/BqmaQKf.png" /> <br>
  <span><i>Interface of Algoviz</i></span>
</p>

Since our application is an algorithm visualizer, we are going to present a lot of different algorithms. Each time the user requests an algorithm, the application load a large React component as a parent component that corresponds to that algorithm. All of these parents would contain other smaller components such as Controls, StepTracker, and Array1D. To visualize the algorithm, the application must keep track of some important **states** such as the array values, the current step, the playing speed, etc..

Though there are variations, parents still contain almost the same type of child components and states, thus sharing a lot of logic. This makes code/logic sharing between parent component extremely important as the application grows. A good sharing method would help tremendously in expanding new algorithms as well as modifying the old ones.

My first implementation of code reuse is with the [Higher-Order Components](https://reactjs.org/docs/higher-order-components.html) (HOC) pattern. The Higher-Order component is essentially a function that contains the common functions that all the similar components share. To apply this component you just wrap it around the main component. For AlgoViz I created `algorithmPages()` function that wraps around all the parent components such as `BinarySeach` and `BubbleSort`. This function contains all the important states of the program and all the functions using these states, including event handlers for the buttons in the Controls component. Why does the parent have to keep codes for the children? It's because of the parent-child component relationship in React.

The relationship between components in React are usually visualized as a component tree. For our application, the component tree looks like this:

<p align="center">
  <img alt="Component tree of AlgoViz" title="Component tree of Algoviz" src="https://i.imgur.com/qEUHayw.png" /> <br>
  <span><i>Component tree of AlgoViz</i></span>
</p>

Consider a use case where the user presses the "Play" button. We expect the algorithm to step forward at some interval of time. More specifically, the current step count would increment every _x_ seconds (depends on the speed) and the highlights in Array1D and StepTracker would change to match the next algorithm step.

From a more technical point of view, once the user clicks the "Play" button, the onClick event is triggered in the Controls component and it must handle all the required changes across multiple components. The method to trigger a component change and rerender is to change the states it depends on. However, Array1D and StepTracker are the siblings, and **_only the direct parent has access to its children_**, so the Control component has no way to access their states. Thus, the easiest solution is to have the parent BubbleSort controls all the states and passes these states along with functions as **props** telling how the children can update other components.

This pattern is called [lifting the state up](https://reactjs.org/docs/lifting-state-up.html) and it works wonderfully for small applications. As the component tree grows though, the process of the parent at level 1 passing props to grand-grandchildren at level 4 is already cumbersome. And we potentially have to do that for all 10+ parent components, each with at least 5 children!

<p align="center">
  <img alt="Props drilling" title="Props drilling" src="https://i.imgur.com/Cl41h4F.png" /> <br>
  <span><i>One component down, 49 more to go...</i></span>
</p>

The term coined for this problem is [props drilling](https://blog.logrocket.com/solving-prop-drilling-react-apps/) and there are many way to fix it. The first solution I considered was [React Context](https://reactjs.org/docs/context.html) since it doesn't require an extra library and its basic syntax is intuitive. With more research, I found that Context comes with a huge performance issue, which could be fixed by wrapping a hook around components, but that would add extra complexity to the program. Furthermore, Context was meant to pass states around for reading only, not modifying, though it is also possible. The complexity of this method grew to the point that learning an actual state management library would be more beneficial.

And so I did. The most popular state management library to date is still [Redux](https://redux.js.org/) and it has been around for the longest, though the more I search, the more I find complaints about this library, mostly about boilerplate aka verbose syntaxes. Many YouTubers like [this guy](https://www.youtube.com/watch?v=BhQYZmaxTCM) even suggest you not learn Redux, though he made a point that a lot of companies are still using Redux thus there are still some advantages in learning it. Eventually, I decided to use [Redux-Toolkit](https://redux-toolkit.js.org/). It's supposed to be Redux with less boilerplate and easier learning curve. This gives me the benefit of having a stepping stone to learn the actual Redux while still being able to quickly implement a state management library to the application.

### Ok but why refactoring?

In the last section, I highlighted the problem with state management and the solution is a third-party library called Redux. The problem is this library by default support functional component and hooks, while the entire program were written with class components. This was also a problem when I researched for an animation library, and [react-spring](https://react-spring.io/) also wrote their documents assuming developers would use hooks. This is a pattern and it looked like the sooner I convert the program, the better for the scalability of AlgoViz.

The official React documents recommend [not to do full conversions](https://reactjs.org/docs/hooks-intro.html), but our application was still relatively small so a full rewrite is safe. Besides, the React developers were expecting people to write new components with hooks, and many have done so, thus switching to a more modern approach is better.

### So what changed?

-   Class components are now in their equivalent functional components.
-   States are now located at a global 'store' instead of at the parent. All components can grab and change states from the store on their own.
-   The parent components no longer hold and control every function used by child components. This means the function's locations are more intuitive. For example, event handlers for buttons Build/Play/Pause/Forward/Backward/Reset are now defined in the Controls component. The parents can still sometimes override the children's functionality through props for customization, but the default functions are still located where they were supposed to be.
-   No longer use HOC for code sharing. [Custom Hooks](https://reactjs.org/docs/hooks-custom.html) is the future for code reuse.

---

---Victor
