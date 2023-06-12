import React, {useState, useEffect, useRef} from 'react';
import "./GraphControls.css";
// onClick would be in GraphControls and import redux to this file

import { randInt, copyObject } from "../../utilities/utilities";
import Draggable from "react-draggable";
import { Coordinate, Edge, Node, NodePositions } from "../../CommonTypes";
import { useDispatch, useSelector } from "react-redux";
import {
    resetGraphInput,
    updateGraphEdges,
    updateGraphNodes,
    updateGraphNodePositions,
    updateIsGraphInputChanged,
} from "../../redux/inputStateSlice";
import { RootState } from "../../redux/configureStore";
import { GraphAlgorithmResultType } from "../../AlgoResultTypes";
import { current } from '@reduxjs/toolkit';
import { computeHeadingLevel } from '@testing-library/dom';
import { parse } from '@fortawesome/fontawesome-svg-core';
import { toast } from 'react-toastify';
import { DEFAULT_EDGES_1 } from '../../assets/default-values';

// default values for variables

const DEFAULT_WIDTH = 500;
const DEFAULT_HEIGHT = 500;
const NODE_RADIUS = 18;
const EDGE_WIDTH = 1;

// error messages for input parsing
const MAX_INPUT_LENGTH = 3;
const ARGUMENT_LENGTH_ERROR = "Invalid number of arguments";
const EDGE_WEIGHT_ERROR = "Edge weight must be a number.";
const NO_PARSING_ERROR = "";

type WeightInputState = {
    show: boolean;
    x: number;
    y: number;
    target: number | null;
};

// ----------------------------------------------

// helper functions independent of the component
const getEdgeTextStyle = (
    n1: Coordinate,
    n2: Coordinate
): [string, { textAnchor: string }] => {
    let first = undefined;
    let second = undefined;

    if (n1.x < n2.x) {
        first = n1;
        second = n2;
    } else {
        first = n2;
        second = n1;
    }

    let dominantBaseline =
        first.y > second.y ? "text-before-edge" : "text-after-edge";
    let style =
        first.x > second.x ? { textAnchor: "end" } : { textAnchor: "start" };

    return [dominantBaseline, style];
};
// ----------------------------------------------

// component
const GraphControls = ({
    center = { x: 0, y: 0 },
    containerWidth = DEFAULT_WIDTH,
    containerHeight = DEFAULT_HEIGHT,
    scale = 1,
    weighed = false,
    ...props
}) => {
    const dispatch = useDispatch();

    // TODO: move these into a constants file 
    const innerGraphBoxWidth = 1000;
    const innerGraphBoxHeight = 450;

    const nodes: string[] = useSelector((state: RootState) => state.input.graphNodes);
    const nodePositions: NodePositions = useSelector((state: RootState) => state.input.graphNodePositions);


    const setNodes = (nodes: string[], newNodePositions: NodePositions) => {
        dispatch(updateGraphNodes(nodes));
        dispatch(updateIsGraphInputChanged(true));
        dispatch(updateGraphNodePositions(newNodePositions));
    };

    const edges: Edge[] = useSelector((state: RootState) => state.input.graphEdges);


    useEffect(() => {
      // redraw lines in text box
      // a - b
      // c
      generateLines();
    }, [nodes, edges])

    const setEdges = (edges: Edge[]) => {
        dispatch(updateGraphEdges(edges));
        dispatch(updateIsGraphInputChanged(true));
    };

    const algorSteps = useSelector(
        (state: RootState) => state.global.algorSteps
    ) as GraphAlgorithmResultType;
    const currentStep = useSelector(
        (state: RootState) => state.global.currentStep
    );

    const [textInput, setTextInput] = useState<string>("");
    const [activeNode, setActiveNode] = useState<string | null>(null);
    const [cursorPos, setCursorPos] = useState<Coordinate>({ x: 0, y: 0 }); // relative to svg element
    const [weightInputState, setWeightInputState] = useState<WeightInputState>({
        show: false,
        x: 0,
        y: 0,
        target: null,
    });
    // when drag stop, an onclick event follows
    // and it messes up with the click to connect function
    // keeping a dragging flag to distinguish the normal click
    // and the click after a drag
    const [nodeCount, setNodeCount] = useState(
        Object.keys(nodePositions).length
    );
    const [isDragging, setisDragging] = useState(false);

    const addNode = (initX: number, initY: number) => {
        let newPosition: Node = {
            init: { x: initX, y: initY },
            x: 0,
            y: 0,
        };
        //let id = nodeCount.toString();
        let element = document.getElementById("addNode") as HTMLInputElement;
        let value = element.value;
        let integerValue = Number.parseInt(value);
        // here we will check if a value has been inputted in
        if (value === "") {
          let error = "Please input a value for the node" as string
          alertMessage(document.getElementById("addNodePortion") as HTMLDivElement, error)
          element.value = "";
          return;
        } else {
          // here we will check if there is an integer given
          if (!Number.isNaN(integerValue)) {
            // here we want to check that the value we are inputting
            // has not yet been in the graph
            // this is because our map needs to have unique values
            if (!nodes.includes(String(integerValue))) {
              let newNodeList = copyObject(nodes) as string[];
              newNodeList.push(value);
              let newNodePositions = copyObject(nodePositions) as NodePositions;
              newNodePositions[value] = newPosition;

              setNodes(newNodeList, newNodePositions);
              setNodeCount((prev) => prev + 1);
            } else {
              let error = "Value already taken!" as string
              alertMessage(document.getElementById("addNodePortion") as HTMLDivElement, error)
              element.value = "";
              return;
            }

          } else {
            let error = "Please give an integer input" as string
            alertMessage(document.getElementById("addNodePortion") as HTMLDivElement, error)
            element.value = "";
            return;
          }
        }
        element.value = "";
    };

    const removeNode = (nodeId: string) => {
        // remove the node and any edges connected with it
        let newNodePositions = copyObject(nodePositions) as NodePositions;
        let newNodeList = copyObject(nodes) as string[];
        let edgesToRemove: number[] = [];
        if (nodeId == '-Select Node-') {
          let error = "Please input a value for the node to remove" as string
          alertMessage(document.getElementById("removeNodePortion") as HTMLDivElement, error)
          return;
        }

        if (nodeId == '-Select Node-') {
          let error = "Please enter in a value" as string
          alertMessage(document.getElementById("removeNodePortion") as HTMLDivElement, error)
          return;
        }



        // look through the nodes
        // if there's a node that matches the nodeId, you're gonna skip in

        // deletion removes the node id from map
        for (let i = 0; i < edges.length; i++) {
            if (edges[i].n1 === nodeId || edges[i].n2 === nodeId) {
                edgesToRemove.push(i);
            }
        }

        // remove from copy
        delete newNodePositions[nodeId];
        newNodeList.splice(newNodeList.indexOf(nodeId), 1);

        // update
        setNodes(newNodeList, newNodePositions);
        removeEdges(edgesToRemove);
    };

    /**
     *
     * @param {string} n1 id of node 1
     * @param {string} n2 id of node 2
     * @param {string} weight
     */
    const addEdge = (n1: string, n2: string, weight: number | undefined) => {
      // check if trying to add edge to the same node
      if (n1 === n2) return;
      // check if edge already exist
      for (const edge of edges) {
          if (
              (edge.n1 === n1 || edge.n2 === n1) &&
              (edge.n1 === n2 || edge.n2 === n2)
          ) {
            let error = "Edge already exists" as string
            alertMessage(document.getElementById("addEdgePortion") as HTMLDivElement, error)
            return;
          }
      }
      setEdges([...edges, { n1, n2, weight }]);
  };

    /**
     * Remove edges.
     *
     * @param {Array} edgesToRemove array of edges (index) to remove
     */
    const removeEdges = (edgesToRemove: number[]) => {
        let copy: Edge[] = [];
        for (let i = 0; i < edges.length; i++) {
            if (!edgesToRemove.includes(i)) {
                copy.push(edges[i]);
            }
        }
        setEdges(copy);
    };


    // This is the functionality where you remove just one edge
    const removeEdge = (start:HTMLSelectElement, end:HTMLSelectElement) => {
      let startValue = "";
      let endValue = "";
      startValue = start.value as string;
      endValue = end.value as string;

      let startCheck = "Start" as string;
      let endCheck = "End" as string;

      if (startValue == startCheck || endValue == endCheck) {
        let error = "Please enter in a value" as string
        alertMessage(document.getElementById("removeEdgePortion") as HTMLDivElement, error)
        return;
      }

      // check if the edge exists
      let found = false;
      let copy: Edge[] = [];
      for (const edge of edges) {
        if (
            (edge.n1 === startValue || edge.n2 === startValue) &&
            (edge.n1 === endValue || edge.n2 === endValue)
        ) {
          found = true;
        } else {
          copy.push(edge);
        }
      }

      if (found) {
        setEdges(copy);
      } else {
        let error = "This edge does not exist" as string
        alertMessage(document.getElementById("removeEdgePortion") as HTMLDivElement, error)
      }

      // Here we will need to append one option for both
      // start and end
      let startReset = document.createElement("option");
      startReset.textContent = "Start";
      let endReset = document.createElement("option");
      endReset.textContent = "End";
      start.innerHTML = "";
      end.innerHTML = "";
      start.appendChild(startReset);
      end.appendChild(endReset);
    };

    const alertMessage = (element:HTMLDivElement, text:string) => {
      // we will give an alert message to the correct element
      let errorMessage = document.createElement('paragraph');
      errorMessage.textContent = text;
      errorMessage.classList.add("errorText");
      let children = element.childNodes;
      let i;
      for (i = 0; i < children.length; i++) {
        let currentChild = children[i] as HTMLElement;
        currentChild.classList.add("hidden");
        setTimeout(() => {
          currentChild.classList.remove("hidden");
        }, 1000);
      }

      element.appendChild(errorMessage);
      setTimeout(() => {
        element.removeChild(errorMessage);
      }, 1000)
    };

// might need these functions for later, possible when we need to
// have weight adding function?
/*
    const modifyEdgeValue = (index: number, value: number) => {
        let copy = copyObject(edges) as Edge[];
        copy[index].weight = value;
        setEdges(copy);
    };

    const hideWeightInputBox = () => {
        if (weightInputState.show)
            setWeightInputState({
                show: false,
                x: 0,
                y: 0,
                target: null,
            });
    };
*/


    /*
    This will add in the nodes that we need for
    each of the select elements that we have
    */
    const getNodes = (element: HTMLSelectElement) => {
      let firstElement = element.firstChild as HTMLOptionElement;
      let firstVal = firstElement.textContent;
      element.innerHTML = "";
      let firstOption = document.createElement("option");
      firstOption.textContent = firstVal;
      let currentElement = element;
      currentElement.appendChild(firstOption);
      let i;
      // here we will add the options to the element that was passed in
      for (i = 0; i < nodes.length; i++) {
        let newOption = document.createElement("option");
        newOption.textContent = nodes[i];
        currentElement.appendChild(newOption);
      }
    };


    type lineReturnType = {
      error: String
      nodes: string[]
      edges?: Edge[]
    }

    const generateNodeLine = (node: string):string => {
      return node + '\n';
    }

    const generateEdgeLine = (edge: Edge):string => {
      let line = edge.n1 + " " + edge.n2;
      if (edge.weight !== undefined) {
        line += " " + edge.weight;
      }
      line += '\n';
      return line;
    }

    // Updates text area with current node data
    const generateLines = () => {
      let nodeSet = new Set<string>(nodes);

      let lines = ''
      // filter out duplicates
      edges.forEach(edge => {
        if (nodeSet.has(edge.n1)) nodeSet.delete(edge.n1)
        if (nodeSet.has(edge.n2)) nodeSet.delete(edge.n2)

        lines += generateEdgeLine(edge);
      })

      nodeSet.forEach(node => {
        lines += generateNodeLine(node)
      })
      setTextInput(lines)
    }

    // Check that given line's input is correctly formatted.
    // If so, parses out nodes and possibly an edge from the line and adds 
    // them to nodeSet and edgeSet
    const processLine = (text: String, nodeSet: Set<string>, edgeSet: Set<Edge>):string => {
      text = text.trim();
      if (text === "") { // Skip empty line
        return NO_PARSING_ERROR;
      }

      let words = text.split(' ');      
      
      if(words.length > MAX_INPUT_LENGTH) {
        return ARGUMENT_LENGTH_ERROR
      } if (words.length === 1) { // just a node
        nodeSet.add(words[0]);
      } if (words.length === 2) { // two nodes with an unweighted edge
        nodeSet.add(words[0])
        nodeSet.add(words[1])
        let e:Edge = {
          n1: words[0],
          n2: words[1]
        }
        edgeSet.add(e)
      } else if (words.length === 3){ // two nodes with weighted edge
        if (isNaN(parseFloat(words[2]))) {
          return EDGE_WEIGHT_ERROR;
        }

        nodeSet.add(words[0])
        nodeSet.add(words[1])
        
        let e:Edge = {
          n1: words[0],
          n2: words[1],
          weight: Number(words[2])
        }
        edgeSet.add(e)
      }
      return NO_PARSING_ERROR;
    }


    const parseInputToGraph = () => {
      const linesOfText = textInput.split('\n');
      // console.log(linesOfText);
      let nodeSet = new Set<string>();
      let edgeSet = new Set<Edge>();

      
      let errorResult = NO_PARSING_ERROR;
      let lineNumber = 0; 

      // Check if each line is valid
      for (lineNumber = 0; lineNumber < linesOfText.length; lineNumber++) {
        let line = linesOfText[lineNumber];
        errorResult = processLine(line, nodeSet, edgeSet);
        if (errorResult !== NO_PARSING_ERROR) {
          break;
        }
      }


      let parsedNodes = Array.from(nodeSet)
      let parsedEdges = Array.from(edgeSet)
      if (errorResult === NO_PARSING_ERROR) { // valid result
        // generate a list of random initial positions for each node
        // let positions = generateNodePositions(parsedNodes, 200, 1.5, 0.975)
        // setNodes(parsedNodes, positions);
        setEdges(parsedEdges);
        // TODO: remove, ugly
        let positions: NodePositions = {};
        nodes.forEach(node => {
          let xCoord = (Math.floor(Math.random() * (innerGraphBoxWidth - NODE_RADIUS * 2)) + NODE_RADIUS);
          let yCoord = (Math.floor(Math.random() * (innerGraphBoxHeight - NODE_RADIUS * 2)) + NODE_RADIUS);
          positions[node] = { init: { x: xCoord, y: yCoord }, x: 0, y: 0 };
        })
        let numTimes = 1;
        setInterval(() => {
          positions = updatePositions(positions, numTimes);
          // console.log(positions)
          setNodes(parsedNodes, positions)
          numTimes++;

        }, 50)

        // push new edges as state 
        toast.success('parsed graph input!!', { position: "bottom-right", autoClose: 2000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, })
      } else {
        // alert the user
        toast.error(errorResult, { position: "bottom-right", autoClose: 2000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, })
      }

      // Check duplicates
      // Check number args

    }


// package pain;
// import java.util.Set;
// import java.util.HashMap;

// /**
//  * Fruch
//  */
// public class FruchSpring implements LayoutAlgorithm {
//   float l;
//   float damping;
//   static float a = 0.000001f;
//   static float repMult = 15000000.0f;
//   static float c = 30000.0f; // spring constant
//   static float springLen = 40.0f; // spring ideal length

//   public FruchSpring(float l, float damping) {
//     this.l = l;
//     this.damping = damping;
//   }

//   public void updateNodes(Graph g) {
//     Set<Node> nodes = g.getNodes();
//     HashMap<Node, Vec2D> forces = new HashMap<Node, Vec2D>();
//     for(Node n : nodes){
//       forces.put(n, netF(n, nodes, g));
//     }

//     for (Node n : nodes){
//       Vec2D force = forces.get(n);
//       n.x += a * damping * force.x;
//       n.y += a * damping * force.y;
//     }
//     this.damping *= damping;
//   }


//   private Vec2D netF(Node n, Set<Node> nodes, Graph g) {
//     Vec2D force = new Vec2D(0.0f, 0.0f);
//     Set<Node> children = g.getChildren(n);

//     for (Node b : nodes) {
//       if (b.equals(n)) continue;

//       Vec2D nVec = new Vec2D(n.x, n.y);
//       Vec2D bVec = new Vec2D(b.x, b.y);
//       Vec2D fr = fRep(nVec, bVec);
//       Vec2D fa = fAttr(nVec, bVec);
//       // only apply spring force if there is an edge (probably exists better way to structure this)
//       if (children.contains(b)) {
//         Vec2D fs = fSpr(nVec, bVec);
//         force.add(fs);
//       }

//       force.add(fr);
//       force.add(fa);
//     }

//     return force;
//   }

//   private Vec2D fRep(Vec2D n, Vec2D o) {
//     float lsq = (float) Math.pow(this.l, 2);
//     float dist = Vec2D.distance(n, o);
//     Vec2D unit = Vec2D.unit(o, n);
//     return unit.scale( repMult * (lsq / dist));
//   }

//   private Vec2D fAttr(Vec2D n, Vec2D o) {
//     float dist = Vec2D.distance(n, o);
//     float dist2 = (float) Math.pow(dist, 2);
//     Vec2D unit = Vec2D.unit(n, o);

//     return unit.scale(dist2 / this.l);
//   }

//   private Vec2D fSpr(Vec2D n, Vec2D o) {
//     // f = -k(x - l)
//     float dist = Vec2D.distance(n, o);
//     dist -= springLen;
//     Vec2D unit = Vec2D.unit(n, o);
//     Vec2D disp = unit.scale(dist); // displacement
//     Vec2D F = disp.scale(c);
//     System.out.println(F);
//     return F;
//   }
  
// }




  const generateNodePositions = (nodes: string[], maxIterations = 10000, l = 1, sigma = 1.0): NodePositions => {
    // generate random positions
    let positions: NodePositions = {};
    nodes.forEach(node => {
      let xCoord = (Math.floor(Math.random() * (innerGraphBoxWidth - NODE_RADIUS * 2)) + NODE_RADIUS);
      let yCoord = (Math.floor(Math.random() * (innerGraphBoxHeight - NODE_RADIUS * 2)) + NODE_RADIUS);
      positions[node] = { init: { x: xCoord, y: yCoord }, x: 0, y: 0 };
    })

    // let positions: NodePositions = generateNodePositions2(nodes) // random positions
    let t = 1;
    // let sigmat = sigma;
    while (t < maxIterations) {
      let forces: { [key: string]: { Fx: number, Fy: number } } = {};
      // for each vertex compute the force on the vertex
      Object.keys(positions).forEach(node => {
        let repForce = netRepForce(positions[node], positions, l);
        // let attrForce = netAttrForce(positions[node], positions, l);


        // let sprForce = netSpringForce(node, nodePositions, edges);

        let force = { Fx: repForce.Fx, Fy: repForce.Fy};
        // let force = { Fx: repForce.Fx + 0.000001 * attrForce.Fx, Fy: repForce.Fy + 0.000001 * attrForce.Fy};
        // let force = { Fx: repForce.Fx + attrForce.Fx + sprForce.Fx, Fy: repForce.Fy + attrForce.Fy + sprForce.Fy};
        forces[node] = force;
      });

      Object.keys(positions).forEach(node => {
        let currPos = positions[node];
        let newPos = copyObject(currPos) as Node;
        newPos.init.x += 0.0001 * forces[node].Fx;
        newPos.init.y += 0.0001 * forces[node].Fy;
        positions[node] = newPos;
      });
      t++;
    }
    return positions;
  }

  const updatePositions = (positions: NodePositions, numTimes:number) => {
      let newP: NodePositions = copyObject(positions) as NodePositions;
    let i = 0;
    // console.log(numTimes)
    while (i++ < numTimes) {
      // console.log(i)

      let forces: { [key: string]: { Fx: number, Fy: number } } = {};
      // for each vertex compute the force on the vertex
      Object.keys(positions).forEach(node => {
        let repForce = netRepForce(positions[node], positions, 1.5);
        let attrForce = netAttrForce(positions[node], positions, 1.5);
        // let sprForce = netSpringForce(node, nodePositions, edges);

        // let force = { Fx: 1500 * repForce.Fx + -0.00001 * attrForce.Fx, Fy: 1500 * repForce.Fy + -0.00001 * attrForce.Fy };
        // let force = { Fx: 15000* repForce.Fx , Fy:  15000*repForce.Fy};
        // console.log(repForce)
        // let force = { Fx: 15000 * repForce.Fx + -0.00001 * attrForce.Fx + sprForce.Fx, Fy: 15000 * repForce.Fy + -0.00001 * attrForce.Fy + sprForce.Fy};
        // let force = {Fx: sprForce.Fx, Fy: sprForce.Fy};
        let force = {Fx: 0, Fy: 0}
        forces[node] = force;
      });

      edges.forEach((edge) => {
        let Fn1 = fSpr(nodePositions[edge.n1], nodePositions[edge.n2])

        let nfN1 = forces[edge.n1]
        let nFN2 = forces[edge.n2]
        
        nfN1.Fx -= Fn1.Fx
        nfN1.Fy -= Fn1.Fy

        nFN2.Fx += Fn1.Fx
        nFN2.Fy += Fn1.Fy

        forces[edge.n1] = nfN1
        forces[edge.n2] = nFN2
      })

      Object.keys(positions).forEach(node => {
        let currPos = positions[node];
        let newPos = copyObject(currPos) as Node;
        newPos.init.x += 0.005 * forces[node].Fx;
        newPos.init.y += 0.005 * forces[node].Fy;
        newP[node] = newPos;
      });

    }
    return newP;
  }

  const netRepForce = (node: Node, nodePositions: NodePositions, l: number): { Fx: number, Fy: number } => {
    // loop through all other node positions, sum up the net between other nodes and this node
    let F: { Fx: number, Fy: number } = { Fx: 0.0, Fy: 0.0 };
    Object.keys(nodePositions).forEach(u => {
      let Fvu = repForce(node, nodePositions[u], l);
      F.Fx += Fvu.Fx;
      F.Fy += Fvu.Fy;
    })
    return F;
  }

  const repForce = (v: Node, u: Node, l: number): { Fx: number, Fy: number } => {
    if (v.init.x === u.init.x && v.init.y === u.init.y) return { Fx: 0.0, Fy: 0.0 };

    // frep(u, v) = (l^2 / ||pv - pu||) * pvpu->
    let dist = Math.sqrt(Math.pow(v.init.x - u.init.x, 2) + Math.pow(v.init.y - u.init.y, 2));
    if (dist === 0) return { Fx: 0.0, Fy: 0.0 }

    let PvPu: { x: number, y: number } = { x: u.init.x - v.init.x, y: u.init.y - v.init.y };
    let scalar = -1*(l ** 2) / (dist**2);
    return { Fx: scalar * PvPu.x, Fy: scalar * PvPu.y };
  }

  const netAttrForce = (node: Node, nodePositions: NodePositions, l: number): { Fx: number, Fy: number } => {
    // loop through all other node positions, sum up the net between other nodes and this node
    let F: { Fx: number, Fy: number } = { Fx: 0.0, Fy: 0.0 };
    Object.keys(nodePositions).forEach(u => {
      let Fvu = attrForce(node, nodePositions[u], l);
      F.Fx += Fvu.Fx;
      F.Fy += Fvu.Fy;
    })
    return F;
  }

  const attrForce = (v: Node, u: Node, l: number): { Fx: number, Fy: number } => {
    if (v.init.x === u.init.x && v.init.y === u.init.y) return { Fx: 0.0, Fy: 0.0 };

    // frep(u, v) = (l^2 / ||pv - pu||) * pvpu->
    let norm = Math.sqrt(Math.pow(v.init.x - u.init.x, 2) + Math.pow(v.init.y - u.init.y, 2));
    let PuPv: { x: number, y: number } = { x: v.init.x - u.init.x, y: v.init.y - u.init.y };
    let scalar = (norm ** 2) / l;
    return { Fx: scalar * PuPv.x, Fy: scalar * PuPv.y };
  }
  const netSpringForce = (node: string, nodePositions: NodePositions, edges: Edge[]): { Fx: number, Fy: number } => {
    // net spring force on a particle

    // loop thru edges, see if this node is involved
    // if so, compute spring foce btwn it and other node in edge (sum all edges in which this occurs)
    let u: Node = nodePositions[node];

    // outer: all edges
    let F: { Fx: number, Fy: number } = { Fx: 0.0, Fy: 0.0 }
    edges.forEach((e: Edge) => {
      if (e.n1 === node) {
        // compute spring force, add it to net force
        // fSpr
        let fS = fSpr(u, nodePositions[e.n2])
        F.Fx += fS.Fx;
        F.Fy += fS.Fy;}
      // } else if (e.n2 === node) {
      //   let fS = fSpr(nodePositions[e.n1], u);
      //   F.Fx -= fS.Fx;
      //   F.Fy -= fS.Fy;
      // }
    })
    // console.log(F)
    return F;
  }

  const fSpr = (n: Node, o: Node): { Fx: number, Fy: number } => {
    let dist = Math.sqrt(Math.pow(n.init.x - o.init.x, 2) + Math.pow(n.init.y - o.init.y, 2));
    // dist -= 400;
    console.log(dist)
    let unitVec: Node = copyObject(o) as Node;
    unitVec.init.x -= n.init.x;
    unitVec.init.y -= n.init.y;

    unitVec.init.x *= dist * 0.1;
    unitVec.init.y *= dist * 0.1;
    return { Fx: unitVec.init.x, Fy: unitVec.init.y };
  }


  const generateNodePositions2 = (nodes: string[]): NodePositions => {
    let positions: NodePositions = {};

    let heightDenominator = 100;
    let widthDenominator = 200;

    let maxDistanceFromPrevious = 100;

    var grid: Boolean[][] = Array(Math.floor(innerGraphBoxHeight / heightDenominator));
    for (var i = 0; i < Math.floor(innerGraphBoxHeight / heightDenominator); i++) {
      grid[i] = Array(Math.floor(innerGraphBoxWidth / widthDenominator)).fill(false);
    }

    let prevCoordinate: null | Coordinate = null;
    nodes.forEach(node => {
      if (prevCoordinate !== null) {

        var xCoord = prevCoordinate.x + maxDistanceFromPrevious * (2 * (Math.random() - 0.5));
        xCoord = xCoord > 0 ? Math.max(xCoord, 20) : Math.min(xCoord, -20);
        var yCoord = prevCoordinate.y + maxDistanceFromPrevious * (2 * (Math.random() - 0.5));
        yCoord = yCoord > 0 ? Math.max(yCoord, 20) : Math.min(yCoord, -20);

        let attempts = 0;
        while (attempts <= 250) {
          console.log("hi")
          // Generate coordinate to be close to previously added node
          xCoord = prevCoordinate.x + maxDistanceFromPrevious * (2 * (Math.random() - 0.5));
          xCoord = xCoord > 0 ? Math.max(xCoord, 20) : Math.min(xCoord, -20);
          yCoord = prevCoordinate.y + maxDistanceFromPrevious * (2 * (Math.random() - 0.5));
          yCoord = yCoord > 0 ? Math.max(yCoord, 20) : Math.min(yCoord, -20);

          xCoord = Math.min(innerGraphBoxWidth - NODE_RADIUS, xCoord);
          xCoord = Math.max(NODE_RADIUS, xCoord);
          yCoord = Math.min(innerGraphBoxHeight - NODE_RADIUS, yCoord)
          yCoord = Math.max(NODE_RADIUS, yCoord)

          let gridRowInd = Math.round(yCoord / heightDenominator);
          gridRowInd = Math.min(gridRowInd, innerGraphBoxWidth / widthDenominator - 1);
          let gridColInd = Math.round(xCoord / widthDenominator);
          gridColInd = Math.min(gridColInd, innerGraphBoxHeight / heightDenominator - 1);

          // If this position does not overlap with existing nodes
          if (!grid[gridRowInd][gridColInd]) {
            grid[gridRowInd][gridColInd] = true;
            break;
          }

          attempts++;
          console.log('retrying')
        }

        positions[node] = { init: { x: xCoord, y: yCoord }, x: 0, y: 0 };
      } else {
        let xCoord = (Math.floor(Math.random() * (innerGraphBoxWidth - NODE_RADIUS * 2)) + NODE_RADIUS);
        let yCoord = (Math.floor(Math.random() * (innerGraphBoxHeight - NODE_RADIUS * 2)) + NODE_RADIUS);
        let gridRowInd = Math.round(yCoord / heightDenominator);
        gridRowInd = Math.min(gridRowInd, innerGraphBoxWidth / widthDenominator - 1);
        let gridColInd = Math.round(xCoord / widthDenominator);
        gridColInd = Math.min(gridColInd, innerGraphBoxHeight / heightDenominator - 1);
        grid[gridRowInd][gridColInd] = true;

        positions[node] = { init: { x: xCoord, y: yCoord }, x: 0, y: 0 };
      }
      prevCoordinate = positions[node].init;
    });
    console.log(grid)
    return positions;
  }
  // Note use the onClick function for all of these buttons
  // and all but the addNode functionality will require a drop down
  // we need to give the select tags, options, so we will need to give
  // the selects the most updated nodes
  // 1. Remove Node: All you will need is to get the most recent nodes, which are "Nodes" constant
  // 2. AddEdge and RemoveEdge: You can also use Nodes for the drop down, but will need
  // Use edges to see if an edge exist or if an edge already exist

  // You can also make functions that will allow you to put options onto the select elements
  return (
    <>
      <div id="body" className='graph-controls-container'>
        <textarea name="body"
          className='graph-input'
          onChange={(e) => setTextInput(e.target.value)}
          value={textInput} />
        <button className='buttonClass'
          onClick={() => {
            // parse
            parseInputToGraph();
          }}
        >build graph.</button>

      </div>
    </>
  )
}

export default GraphControls;