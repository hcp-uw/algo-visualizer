/**
 * Sort algorithms will take an array of (numbers/objects) as the elements to perform algorithm.
 * The output will be an object containing the steps.
 *
 * The steps array contains the objects about the state of the array at a given step.
 *
 * INPUT:    array: Array(Numbers/Objects). Eg.: [1,2,3,4,5,6,7]
 * OUTPUT:   Object in format
 *              {
 *                  steps:      Array(JSON)   more detail at the doc of respective function
 *                  success:    Bool
 *              }
 */

/**
 * Helper function to swap two elements in an array.
 *
 * @param {array} array
 * @param {integer} i first index
 * @param {integer} j second index
 */
function swap(array, i, j) {
    var t = array[i];
    array[i] = array[j];
    array[j] = t;
}
/**
 * Bubble sort. Swapping two element adjacent elements if they are in wrong order,
 * until the entire array is sorted.
 * At the end of one iteration, at least one element is sorted.
 *
 * @param {*} arr array of numbers
 * @param {*} descending // unused option for sorting array descending
 * @returns json object in format mentioned above. The step object is in format:
 *              {
 *                  array (Array[Numbers]): The indexes of elements, aka the state of the entire array at a given step
 *                                          Ex: [2,0,1], at this step, the third element in the original array is now at the first index
 *                                                                     the first element in the original array is now at the second index...
 *                  highlight(Array[Numbers]): The indexes that are being focused
 *                  sorted(Array[Number]): The indexes of sorted elements
 *                  swapped(Bool): Mark if a swap is happening at this step
 *                  swapCount(Number): The number of swaps happened up to this step
 *                  description(String): something about whats happening
 *              }
 */
function bubbleSort(arr, descending = false) {
    if (arr.length <= 1) return;
    var r = { steps: [] };

    // multiplier for ascending/descending sort
    var mul = descending ? 1 : -1;

    // flag for if a swap happened in one whole iteration
    var swapped = true;
    var sorted = [];
    var swapCount = 0;
    var ids = [...Array(arr.length).keys()];
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr.length - 1 - i; j++) {
            r.steps.push({
                array: [...ids],
                highlight: [ids[j], ids[j + 1]],
                sorted: [...sorted],
                swapped: false,
                swapCount: swapCount,
                description: `Comparing index ${j}(=${arr[ids[j]]}) and index ${
                    j + 1
                }(=${arr[ids[j + 1]]})`,
            });
            // compare with the next element
            if ((arr[ids[j + 1]] - arr[ids[j]]) * mul > 0) {
                swap(ids, j, j + 1);
                swapped = true;
                swapCount++;
                r.steps.push({
                    array: [...ids],
                    highlight: [ids[j], ids[j + 1]],
                    sorted: [...sorted],
                    swapped: true,
                    swapCount: swapCount,
                    description: `${arr[ids[j]]} < ${
                        arr[ids[j + 1]]
                    }. Swapping index ${j} and ${j + 1}`,
                });
            }
        }
        if (!swapped) {
            // if no swap happened, the entire array is sorted
            sorted = ids;
        } else {
            // at the end of each iteration, the last non sorted elemented is guaranteed to be sorted
            if (descending) {
                sorted.push(ids[i]);
            } else {
                sorted.push(ids[arr.length - 1 - i]);
            }
        }
        r.steps.push({
            array: [...ids],
            highlight: [],
            sorted: [...sorted],
            swapped: false,
            swapCount: swapCount,
            description: `Index ${arr.length - i - 1} is sorted`,
        });
    }

    return r;
}

/**
 * Insertion sort. Build the sorted array one at a time by sliding an element to one
 * end of the array until they are in order.
 *
 * @param {*} arr array of numbers
 * @param {*} descending // unused option for sorting array descending
 * @returns json object in format mentioned above. The step object is in format:
 *              {
 *                  array (Array[Numbers]): The indexes of elements, aka the state of the entire array at a given step
 *                                          Ex: [2,0,1], at this step, the third element in the original array is now at the first index
 *                                                                     the first element in the original array is now at the second index...
 *                  highlight(Array[Numbers]): The indexes that are being focused
 *                  sorted(Array[Number]): The indexes of sorted elements
 *                  swapped(Bool): Mark if a swap is happening at this step
 *                  swapCount(Number): The number of swaps happened up to this step
 *                  description(String): something about whats happening
 *              }
 */
function insertionSort(arr) {
    if (arr.length <= 1) return;

    var r = { steps: [] };
    var sorted = [];
    var swapCount = 0;
    var ids = [...Array(arr.length).keys()];

    // first element is sorted always
    sorted.push(ids[0]);
    r.steps.push({
        array: [...ids],
        highlight: [],
        sorted: [...sorted],
        swapped: false,
        swapCount: swapCount,
        description: "First element is sorted",
    });
    var p = 1;
    var i = 1;
    while (i < arr.length) {
        // start pushing the ith index to the sorted partition
        r.steps.push({
            array: [...ids],
            highlight: [ids[p]],
            sorted: [...sorted],
            swapped: false,
            swapCount: swapCount,
            description: `Start inserting index ${i} to the sorted partition`,
        });
        // compare the ith element with the preceeding one.
        // if the current one smaller, swap the two elements
        while (p > 0 && arr[ids[p]] < arr[ids[p - 1]]) {
            swap(ids, p, p - 1);
            swapCount++;
            r.steps.push({
                array: [...ids],
                highlight: [ids[p], ids[p - 1]],
                sorted: [...sorted],
                swapped: true,
                swapCount: swapCount,
                description: `${arr[ids[p]]} > ${
                    arr[ids[p - 1]]
                }. Swapping index ${p} and ${p - 1}`,
            });
            p--;
        }
        // recognize that the ith index is sorted
        sorted.push(ids[p]);
        r.steps.push({
            array: [...ids],
            highlight: [],
            sorted: [...sorted],
            swapped: false,
            swapCount: swapCount,
            description: `Index ${i} is now sorted`,
        });
        i++;
        p = i;
    }
    return r;
}

/**
 * Selection Sort. Build the sorted array one at a time by finding the minimum value among the
 * unsorted values and put it at the end of the sorted partition.
 *
 * @param {*} arr array of numbers
 * @param {*} descending // unused option for sorting array descending
 * @returns json object in format mentioned above. The step object is in format:
 *              {
 *                  array (Array[Numbers]): The indexes of elements, aka the state of the entire array at a given step
 *                                          Ex: [2,0,1], at this step, the third element in the original array is now at the first index
 *                                                                     the first element in the original array is now at the second index...
 *                  highlight(Array[Numbers]): The indexes that are being focused
 *                  sorted(Array[Number]): The indexes of sorted elements
 *                  swapped(Bool): Mark if a swap is happening at this step
 *                  swapCount(Number): The number of swaps happened up to this step
 *                  min(Number): The index of the minimum element.
 *                  description(String): something about whats happening
 *              }
 */
function selectionSort(arr) {
    if (arr.length <= 1) return;

    var r = { steps: [] };
    var sorted = [];
    var swapCount = 0;
    var ids = [...Array(arr.length).keys()];
    var minI = 0;
    for (var i = 0; i < arr.length; i++) {
        minI = i;
        // start of new iteration
        r.steps.push({
            array: [...ids],
            highlight: [ids[i]],
            sorted: [...sorted],
            swapped: false,
            swapCount: swapCount,
            min: ids[minI],
            description:
                `Starting iteration #${i + 1}. New minima is ` + arr[ids[i]],
        });
        for (var j = i + 1; j < arr.length; j++) {
            // start traversing the rest of array
            r.steps.push({
                array: [...ids],
                highlight: [ids[j]],
                sorted: [...sorted],
                swapped: false,
                swapCount: swapCount,
                min: ids[minI],
                description: "Checking index " + j,
            });
            if (arr[ids[minI]] > arr[ids[j]]) {
                // take the new min
                r.steps.push({
                    array: [...ids],
                    highlight: [],
                    sorted: [...sorted],
                    swapped: false,
                    swapCount: swapCount,
                    min: ids[minI],
                    description:
                        `Found new minima (${arr[ids[j]]} < ${
                            arr[ids[minI]]
                        }) at index ` + j,
                });
                minI = j;
            }
        }
        if (i !== minI) {
            swap(ids, i, minI);
            // swap at the end of iteration
            r.steps.push({
                array: [...ids],
                highlight: [ids[i], ids[minI]],
                sorted: [...sorted],
                swapped: true,
                swapCount: swapCount,
                min: ids[i],
                description: `Swapping index ${i}(=${
                    arr[ids[i]]
                }) and ${minI}(=${arr[ids[minI]]})`,
            });
        }

        sorted.push(ids[i]);
        // recognize the i index is sorted
        r.steps.push({
            array: [...ids],
            highlight: [],
            sorted: [...sorted],
            swapped: false,
            swapCount: swapCount,
            min: -1,
            description: `Index ${i} is now sorted`,
        });
    }

    return r;
}

//----------------------------------MERGE SORT----------------------------------------------

function mergeSort(arr) {
    let r = { steps: [], compareCount: 0 };
    let positions = [];
    let ids = [...Array(arr.length).keys()];

    for (let i = 0; i < arr.length; i++) {
        positions[i] = {
            level: 0,
            treePos: 0,
            pos: i,
        };
    }

    r.steps.push({
        positions: copyOject(positions),
        highlight: [],
        swapped: false,
        compareCount: r.compareCount,
        sorted: false,
        description: "Starting merge sort...",
    });

    mergeSortHelper(arr, ids, r, positions, 0, 0);

    r.steps.push({
        positions: copyOject(positions),
        highlight: [],
        swapped: false,
        compareCount: r.compareCount,
        sorted: true,
        description: "Array is sorted!",
    });

    return r;
}

function mergeSortHelper(arr, ids, r, positions, level, treePos) {
    let n = ids.length;
    if (n == 1) return ids;

    // split array to two halfs
    let mid = Math.floor(n / 2);
    let ids1 = ids.slice(0, mid);
    let ids2 = ids.slice(mid, n);

    // adding step
    fillSubarrayPositions(ids1, ids2, positions, level, treePos);
    let step = {
        positions: copyOject(positions),
        highlight: ids1.concat(ids2),
        swapped: false,
        compareCount: r.compareCount,
        sorted: false,
        description: `Splitting array into subarrays...`,
    };
    r.steps.push(step);

    // split themselves
    ids1 = mergeSortHelper(arr, ids1, r, positions, level + 1, 2 * treePos + 1);
    ids2 = mergeSortHelper(
        arr,
        ids2,
        r,
        positions,
        level + 1,
        2 * (treePos + 1)
    );

    // adding step
    fillSubarrayPositions(ids1, ids2, positions, level, treePos);
    step = {
        positions: copyOject(positions),
        highlight: ids1.concat(ids2),
        swapped: false,
        compareCount: r.compareCount,
        sorted: false,
        description: `Merging subarrays...`,
    };
    r.steps.push(step);

    // merge them together
    return mergeHelper(arr, ids1, ids2, r, positions, level, treePos);
}

function mergeHelper(arr, ids1, ids2, r, positions, level, treePos) {
    let ids3 = [];

    // compare and add the front element of each array until one is empty
    while (ids1.length > 0 && ids2.length > 0) {
        // add step for comparing
        fillSubarrayPositions(ids1, ids2, positions, level, treePos);
        let step = {
            positions: copyOject(positions),
            highlight: [ids1[0], ids2[0]],
            swapped: false,
            compareCount: r.compareCount,
            sorted: false,
            description: `Comparing ${arr[ids1[0]]} and ${arr[ids2[0]]}...`,
        };

        r.steps.push(step);

        // comparing the front elements
        let description = "";
        let highlighted = [ids1[0], ids2[0]];
        if (arr[ids1[0]] > arr[ids2[0]]) {
            description = `${arr[ids2[0]]} < ${arr[ids1[0]]}. Pushing ${
                arr[ids2[0]]
            } to merged array.`;
            ids3.push(ids2[0]);
            ids2 = ids2.slice(1, ids2.length);
        } else {
            // case that two elements are equal
            if (arr[ids1[0]] === arr[ids2[0]]) {
                description = `${arr[ids1[0]]} = ${arr[ids2[0]]}. Pushing ${
                    arr[ids1[0]]
                } to merged array.`;
            } else {
                description = `${arr[ids1[0]]} < ${arr[ids2[0]]}. Pushing ${
                    arr[ids1[0]]
                } to merged array.`;
            }
            ids3.push(ids1[0]);
            ids1 = ids1.slice(1, ids1.length);
        }
        r.compareCount++;

        // add step for swapping
        fillSubarrayPositions(ids1, ids2, positions, level, treePos);
        for (let i = 0; i < ids3.length; i++) {
            positions[ids3[i]] = {
                level: level,
                treePos: treePos,
                pos: i,
            };
        }
        step = {
            positions: copyOject(positions),
            highlight: highlighted,
            swapped: true,
            compareCount: r.compareCount,
            sorted: false,
            description: description,
        };
        r.steps.push(step);
    }

    // add the remaining leftover elements
    // it is guaranteed that at least 1 element will be leftover in either array
    let description =
        ids1.length > 0
            ? `Moving remaining elements from left array`
            : `Moving remaining elements from right array`;

    while (ids1.length > 0) {
        ids3.push(ids1[0]);
        ids1 = ids1.slice(1, ids1.length);
    }

    while (ids2.length > 0) {
        ids3.push(ids2[0]);
        ids2 = ids2.slice(1, ids2.length);
    }

    // adding a step for adding remainders

    for (let i = 0; i < ids3.length; i++) {
        positions[ids3[i]] = {
            level: level,
            treePos: treePos,
            pos: i,
        };
    }
    step = {
        positions: copyOject(positions),
        highlight: ids3,
        swapped: false,
        compareCount: r.compareCount,
        sorted: false,
        description: description,
    };
    r.steps.push(step);

    return ids3;
}

function fillSubarrayPositions(ids1, ids2, positions, level, treePos) {
    for (let i = 0; i < ids1.length; i++) {
        positions[ids1[i]] = {
            level: level + 1,
            treePos: 2 * treePos + 1,
            pos: i,
        };
    }
    for (let i = 0; i < ids2.length; i++) {
        positions[ids2[i]] = {
            level: level + 1,
            treePos: 2 * (treePos + 1),
            pos: i,
        };
    }
}

function copyOject(obj) {
    return JSON.parse(JSON.stringify(obj));
}
//-----------------------------------------------------------------------------------------

module.exports = {
    bubbleSort,
    insertionSort,
    selectionSort,
    mergeSort,
};
