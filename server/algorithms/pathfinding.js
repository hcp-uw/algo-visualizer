/**
 * 
 * Pathfinding algorithms
 * 
 */

const getNodesFromCurr = (graph, nodeIdx) => {
    const returnNodes = [];
    for (var i = 0; i < graph[nodeIdx].length; i++) {
        if (graph[nodeIdx][i] != null) {
            returnNodes.push({n: i, w: graph[nodeIdx][i]})
        }
    }
    return returnNodes;
}

/**
 * Search for value in graph by exploring
 * depth first in a directed graph
 *
 * @param {*} graph
 * @param {*} start
 * @param {*} target
 * @returns r the result object
 */
function dfs(graph, start, target) {
    const stack = [];
    const remove = () => stack.splice(stack.length - 1, 1)[0];
    return generic(graph, start, target, stack, remove);
}

/**
 * Search for value in graph by exploring
 * breadth first in a directed graph
 *
 * @param {*} graph
 * @param {*} start
 * @param {*} target
 * @returns r the result object
 */
function bfs(graph, start, target) {
    const queue = [];
    const remove = () => queue.splice(0, 1)[0];
    return generic(graph, start, target, queue, remove);
}

function generic(graph, start, target, structure, remove) {
    var r = { steps: [], success: false, start: start, target: target };

    if (start === target) {
        r.steps.push({
            highlight: [],
            visited: [],
            description:
                `The target node is the same as the start node`,
        });
        r.success = true;
        return r;
    }
    
    const visited = [];
    const touched = [];
    structure.push(start);
    touched.push(start);

    var foundTarget = false;
    
    while (structure.length > 0 && !foundTarget) {
        curr = remove();
        visited.push(curr);
        connected = getNodesFromCurr(graph, curr);
        connectedNodes = [];
        for (var i = 0; i < connected.length; i++) {
            connectedNodes.push(connected[i].n);
            var node = connected[i].n;
            if (!touched.includes(node)) {
                structure.push(node);
                touched.push(node);
            }
        }
        r.steps.push({
            highlight: [...connectedNodes],
            visited: [...visited],
            description:
                `Visiting node ${curr}`,
        });
        if (curr === target) {
            foundTarget = true;
        }
    }

    if (foundTarget) {
        r.steps.push({
            highlight: [],
            visited: [...visited],
            description:
                `Found the target node`,
        });
        r.success = true;
    } else {
        r.steps.push({
            highlight: [],
            visited: [...visited],
            description:
                `Could not find the target node`,
        });
    }

    return r;
}

/**
 * Search for the lowest cost path
 * from the start to the target in a
 * weighted grid.
 *
 * @param {*} graph a two dimension array of values corresponding to weights
 * @param {*} start looks like {row: int, col: int}
 * @param {*} target looks like {row: int, col: int}
 * @returns r the result object
 */
 function aStar(graph, start, target) {
    var r = { steps: [], success: false, start: start, target: target };
    const getKey = (row, column) => row * graph[0].length + column;
    const startKey = getKey(start.row, start.col);
    const targetKey = getKey(target.row, target.col);

    const rowMods = [-1, -1, -1, 0, 0, 1, 1, 1];
    const colMods = [-1, 0, 1, -1, 1, -1, 0, 1];
    const weights = [14, 10, 14, 10, 10, 14, 10, 14];
    const visitedKeys = [];
    const visited = [];
    const costs = Array(graph.length * graph[0].length);
    costs.forEach((item, i, arr) => {arr[i] = " "});
    const touchedKeys = [];

    const getUnvisitedNeighbors = (val) => {
        let neighbors = [];
        for (var i = 0; i < rowMods.length; i++) {
            let currRow = val.row + rowMods[i];
            let currCol = val.col + colMods[i];
            let isAvail = currRow >= 0 && currRow < graph.length &&
                          currCol >= 0 && currCol < graph[0].length;
            var dRow = Math.abs(currRow - target.row);
            var dCol = Math.abs(currCol - target.col);
            var h;
            if (dRow <= dCol) {
                h = dRow * 14 + (dCol - dRow) * 10;
            } else {
                h = dCol * 14 + (dRow - dCol) * 10;
            }
            let currKey = getKey(currRow, currCol);
            let pKey = getKey(val.row, val.col);
            if (
                isAvail && !touchedKeys.includes(currKey) && graph[currRow][currCol] !== null
                // or cost is cheaper from here
            ) {
                let g = weights[i] + val.g + graph[currRow][currCol];
                let weight = g + h;
                neighbors.push({parent: pKey, row: currRow, col: currCol, cost: weight, g: g});
                touchedKeys.push(currKey);
            }
        }
        return neighbors;
    }

    let priorityQ = [];
    const getMin = () => {
        let minIdx = 0;
        priorityQ.forEach((item, index, pq) => {
            if (item.cost < pq[minIdx].cost) {
                minIdx = index;
            }
        });
        if (priorityQ.length === 1) {
            var n = priorityQ[0];
            priorityQ = [];
            return n;
        } else {
            return priorityQ.splice(minIdx, 1)[0];
        }
    }
    
    // create the path
    priorityQ.push({parent: null, row: start.row, col: start.col, cost: 0, g: 0});
    costs[startKey] = "Start";
    costs[targetKey] = "Target";
    touchedKeys.push(startKey);
    while (priorityQ.length > 0) {
        let val = getMin();
        let valKey = getKey(val.row, val.col);
        visitedKeys.push(valKey);
        visited.push(val);
        if (valKey === targetKey) break;
        neighbors = getUnvisitedNeighbors(val);
        let neighborKeys = [];
        neighbors.forEach(item => {
            key = getKey(item.row, item.col);
            neighborKeys.push(key);
            costs[key] = item.cost.toString();
            priorityQ.push(item);
        });
        r.steps.push({
            curr: valKey,
            highlight: [...neighborKeys],
            visited: [...visitedKeys],
            costs: [...costs],
            path: [],
            description:
                `Visiting node ${getKey(val.row, val.col)}`,
        });
    }

    if (targetKey !== visitedKeys[visitedKeys.length - 1]) {
        // the path couldn't be found
        r.steps.push({
            curr: -1,
            highlight: [],
            visited: [...visitedKeys],
            costs: [...costs],
            path: [],
            description:
                `Visited all connected nodes, target node not found`,
        });
    } else {
        r.success = true;

        const getParentIndex = (visitedIndex) => {
            parentKey = visited[visitedIndex].parent;
            return visitedKeys.indexOf(parentKey);
        }

        // retrace the path
        var pathKeys = [];
        var currIdx = visited.length - 1;
        while (currIdx != 0) {
            pathKeys.push(getKey(visited[currIdx].row, visited[currIdx].col));
            r.steps.push({
                curr: -1,
                highlight: [],
                path: [...pathKeys],
                visited: [...visitedKeys],
                costs: [...costs],
                description:
                    `Adding node ${getKey(visited[currIdx].row, visited[currIdx].col)} to path`, 
            });
            currIdx = getParentIndex(currIdx);
        }
        pathKeys.push(startKey);
        r.steps.push({
            curr: -1,
            highlight: [],
            path: [...pathKeys],
            visited: [...visitedKeys],
            costs: [...costs],
            description:
                `Adding node ${getKey(visited[currIdx].row, visited[currIdx].col)} to path`, 
        });
    }
    return r;
 }

module.exports = {
    dfs,
    bfs,
    aStar,
};