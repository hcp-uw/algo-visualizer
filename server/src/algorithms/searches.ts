/**
 * Search algorithms will take an array of (numbers/objects) as the elements to perform algorithm.
 * The output will be an object containing the steps and a success flag.
 *
 * INPUT:    array: Array(Numbers/Objects). Eg.: [1,2,3,4,5,6,7]
 *           value: Number/Object. The target value to search.
 * OUTPUT:   Object in format
 *              {
 *                  steps:      Array(Object{ element, description })
 *                  success:    boolean
 *              }
 */

import {
    BinarySearchResultType,
    DepthFirstSearchResultType,
    BreadthFirstSearchResultType,
    LinearSearchResultType,
} from "../AlgoResultTypes";
import { Edge, NodeMap } from "../CommonTypes";

function copyObject(obj: Object): Object {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Search for value by going through the array
 * one-by-one in order.
 *
 * @param {*} arr
 * @param {*} target
 * @returns r the result object
 */
function linearSearch(arr: number[], target: number) {
    let r: LinearSearchResultType = {
        steps: [],
        success: false,
        target: target,
        foundIndex: -1,
    };

    for (let i = 0; i < arr.length; i++) {
        r.steps.push({ element: i, description: `Checking index ${i}` });
        if (arr[i] === target) {
            r.success = true;
            r.foundIndex = i;
            break;
        }
    }
    // mark the final step for highlight and stuff
    r.steps.push({
        element: -1,
        description: r.success
            ? `Element found at index ${r.foundIndex}!`
            : `Element not found!`,
    });
    return r;
}

/**
 * The steps in binary search also return the left and right boundary
 * for extra visuals.
 */
function binarySearch(arr: number[], target: number) {
    let result: BinarySearchResultType = {
        steps: [],
        success: false,
        target: target,
        foundIndex: -1,
    };
    let l = 0,
        r = arr.length - 1;

    // array is not sorted
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] > arr[i + 1]) {
            result.steps.push({
                step: -1,
                l: l,
                r: r,
                description: "Array is not sorted! Search aborted",
            });
            return result;
        }
    }

    while (l <= r) {
        // calculate middle index
        let m = Math.floor((l + r) / 2);
        result.steps.push({
            step: m,
            l: l,
            r: r,
            description: `Checking middle element at index ${m}(=floor(${l}+${r})/2)`,
        });
        // check if middle is target
        if (arr[m] === target) {
            l = m;
            r = m;
            result.success = true;
            result.foundIndex = m;
            break;
        }

        let description = "";
        // move left/right bound
        if (arr[m] < target) {
            l = m + 1;
            description = `Middle element is less than target (${arr[m]}<${target}). Moving left bound to index ${l} (middle+1)`;
        } else {
            r = m - 1;
            description = `Middle element is greater than target (${arr[m]}>${target}). Moving right bound to index ${r} (middle-1)`;
        }

        result.steps.push({ step: -2, l: l, r: r, description: description });
    }
    // when element is found, the last bound moving step is unesessary to report
    if (!result.success) result.steps.pop();
    // report the result
    result.steps.push({
        step: -1,
        l: l,
        r: r,
        description: result.success
            ? `Element found at index ${result.foundIndex}!`
            : `Element not found!`,
    });
    return result;
}

type NodeWithPrev = { id: string; from: string };

function depthFirstSearch(nodes: string[], edges: Edge[], start: string = "") {
    let result: DepthFirstSearchResultType = {
        steps: [],
        traversalResult: [],
        startNode: "",
    };
    let adjacencyMap: { [key: string]: string[] } = {};
    let stack: NodeWithPrev[] = [];
    let visited: string[] = [];
    let visitedEdges: Edge[] = [];

    if (nodes.length === 0) return result;

    for (let i = 0; i < nodes.length; i++) {
        adjacencyMap[nodes[i]] = [];
    }

    // build adjacency map
    for (let i = 0; i < edges.length; i++) {
        // add to front so we search from left to right
        adjacencyMap[edges[i].n1].unshift(edges[i].n2);
        adjacencyMap[edges[i].n2].unshift(edges[i].n1);
    }

    if (!start) start = nodes[0].toString();
    stack.push({ id: start, from: "" });
    result.startNode = start.toString();

    result.steps.push({
        stack: copyObject(stack) as NodeWithPrev[],
        currentNode: [],
        visitedNodes: copyObject(visited) as string[],
        visitedEdges: copyObject(visitedEdges) as Edge[],
        description: `Starting from node ${start}`,
    });

    // dfs
    while (stack.length > 0) {
        // front of the list is the top of the stack
        let node = stack.pop() as NodeWithPrev;

        if (!visited.includes(node.id)) {
            visited.push(node.id);
            // add visited edge
            visitedEdges.push({ n1: node.from, n2: node.id });

            result.steps.push({
                stack: copyObject(stack) as NodeWithPrev[],
                currentNode: [node.id],
                visitedNodes: copyObject(visited) as string[],
                visitedEdges: copyObject(visitedEdges) as Edge[],
                description: `Visiting node ${node.id}`,
            });

            // collecting adjacent nodes
            let addedAdj = [];
            for (const n of adjacencyMap[node.id]) {
                if (!visited.includes(n)) {
                    addedAdj.push(n);
                    stack.push({ id: n, from: node.id });
                }
            }

            result.steps.push({
                stack: copyObject(stack) as NodeWithPrev[],
                currentNode: [],
                visitedNodes: copyObject(visited) as string[],
                visitedEdges: copyObject(visitedEdges) as Edge[],
                description:
                    addedAdj.length > 0
                        ? `Added adjacent nodes ${addedAdj.toString()} to the stack.`
                        : "Did not add any adjacent nodes.",
            });
        } else {
            result.steps.push({
                stack: copyObject(stack) as NodeWithPrev[],
                currentNode: [],
                visitedNodes: copyObject(visited) as string[],
                visitedEdges: copyObject(visitedEdges) as Edge[],
                description: `Node ${node.id} already visited!`,
            });
        }
    }

    result.steps.push({
        stack: copyObject(stack) as NodeWithPrev[],
        currentNode: [],
        visitedNodes: copyObject(visited) as string[],
        visitedEdges: copyObject(visitedEdges) as Edge[],
        description: `Traversal finished.`,
    });
    result.traversalResult = visited;
    return result;
}


function breadthFirstSearch(nodes: string[], edges: Edge[], start: string = "") {
    let result: BreadthFirstSearchResultType = {
        steps: [],
        traversalResult: [],
        startNode: "",
    };
    let adjacencyMap: { [key: string]: string[] } = {};
    let queue: NodeWithPrev[] = [];
    let visited: string[] = [];
    let visitedEdges: Edge[] = [];

    if (nodes.length === 0) return result;

    for (let i = 0; i < nodes.length; i++) {
        adjacencyMap[nodes[i]] = [];
    }

    // build adjacency map
    for (let i = 0; i < edges.length; i++) {
        // add to front so we search from left to right
        adjacencyMap[edges[i].n1].unshift(edges[i].n2);
        adjacencyMap[edges[i].n2].unshift(edges[i].n1);
    }

    if (!start) start = nodes[0].toString();
    queue.push({ id: start, from: "" });
    result.startNode = start.toString();

    result.steps.push({
        queue: copyObject(queue) as NodeWithPrev[],
        currentNode: [],
        visitedNodes: copyObject(visited) as string[],
        visitedEdges: copyObject(visitedEdges) as Edge[],
        description: `Starting from node ${start}`,
    });

    // bfs
    while (queue.length > 0) {
        // front of the list is the front of the queue
        let node = queue.shift() as NodeWithPrev;

        if (!visited.includes(node.id)) {
            visited.push(node.id);
            // add visited edge
            visitedEdges.push({ n1: node.from, n2: node.id });

            result.steps.push({
                queue: copyObject(queue) as NodeWithPrev[],
                currentNode: [node.id],
                visitedNodes: copyObject(visited) as string[],
                visitedEdges: copyObject(visitedEdges) as Edge[],
                description: `Visiting node ${node.id}`,
            });

            // collecting adjacent nodes
            let addedAdj = [];
            for (const n of adjacencyMap[node.id]) {
                if (!visited.includes(n)) {
                    addedAdj.push(n);
                }

            }
            // Add nodes to queue from least to greatest order
            addedAdj.sort();
            for (const n of addedAdj) {
                queue.push({ id: n, from: node.id });
            }

            result.steps.push({
                queue: copyObject(queue) as NodeWithPrev[],
                currentNode: [],
                visitedNodes: copyObject(visited) as string[],
                visitedEdges: copyObject(visitedEdges) as Edge[],
                description:
                    addedAdj.length > 0
                        ? `Added adjacent nodes ${addedAdj.toString()} to the queue.`
                        : "Did not add any adjacent nodes.",
            });
        } else {
            result.steps.push({
                queue: copyObject(queue) as NodeWithPrev[],
                currentNode: [],
                visitedNodes: copyObject(visited) as string[],
                visitedEdges: copyObject(visitedEdges) as Edge[],
                description: `Node ${node.id} already visited!`,
            });
        }
    }

    result.steps.push({
        queue: copyObject(queue) as NodeWithPrev[],
        currentNode: [],
        visitedNodes: copyObject(visited) as string[],
        visitedEdges: copyObject(visitedEdges) as Edge[],
        description: `Traversal finished.`,
    });
    result.traversalResult = visited;
    return result;
}


export { linearSearch, binarySearch, depthFirstSearch, breadthFirstSearch };
