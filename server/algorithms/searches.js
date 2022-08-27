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

function copyObject(obj) {
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
function linearSearch(arr, target) {
    var r = { steps: [], success: false, target: target, foundIndex: -1 };

    for (var i = 0; i < arr.length; i++) {
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
function binarySearch(arr, target) {
    var result = { steps: [], success: false, target: target, foundIndex: -1 };
    var l = 0,
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
        var m = Math.floor((l + r) / 2);
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

function depthFirstSearch(nodes, edges, start) {
    if (nodes.length === 0) return [];

    let result = { steps: [] };
    let adjacencyMap = [];
    let stack = [];
    let visited = [];
    let visitedEdges = [];

    for (let i = 0; i < nodes.length; i++) {
        adjacencyMap[i] = [];
    }

    // build adjacency map
    for (let i = 0; i < edges.length; i++) {
        // add to front so we search from left to right
        adjacencyMap[edges[i].n1].unshift(edges[i].n2);
        adjacencyMap[edges[i].n2].unshift(edges[i].n1);
    }

    stack.push(start);

    result.steps.push({
        stack: copyObject(stack),
        currentNode: [],
        visitedNode: copyObject(visited),
        visitedEdges: copyObject(visitedEdges),
        description: `Starting from node ${start}`,
    });

    // dfs
    while (stack.length > 0) {
        let node = stack.pop();
        visited.push(node);
        // add visited edge

        result.steps.push({
            stack: copyObject(stack),
            currentNode: [node],
            visitedNode: copyObject(visited),
            visitedEdges: copyObject(visitedEdges),
            description: `Visiting node ${node}`,
        });

        for (const n of adjacencyMap[node]) {
            if (!visited.includes(n)) stack.push(n);
        }

        result.steps.push({
            stack: copyObject(stack),
            currentNode: [],
            visitedNode: copyObject(visited),
            visitedEdges: copyObject(visitedEdges),
            description: `Finished visiting node ${node}`,
        });
    }

    result.steps.push({
        stack: copyObject(stack),
        currentNode: [],
        visitedNode: copyObject(visited),
        visitedEdges: copyObject(visitedEdges),
        description: `Graph traversed.`,
    });
    result.traversalResult = visited;
    return result;
}

module.exports = {
    linearSearch,
    binarySearch,
    depthFirstSearch,
};
