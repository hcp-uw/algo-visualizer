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

import { BubbleSortResultType, InsertionSortResultType, MergeSortResultType, QuickSortResultType, SelectionSortResultType } from "../AlgoResultTypes";

/**
 * Helper function to swap two elements in an array.
 *
 * @param {array} array
 * @param {integer} i first index
 * @param {integer} j second index
 */
function swap(array:number[], i:number, j:number) {
    let t = array[i];
    array[i] = array[j];
    array[j] = t;
}
/**
 * Bubble sort. Swapping two element adjacent elements if they are in wrong order,
 * until the entire array is sorted.
 * At the end of one iteration, at least one element is sorted.
 *
 * @param arr array of numbers
 * @param descending // unused option for sorting array descending
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
function bubbleSort(arr:number[], descending = false) {
    if (arr.length <= 1) return "Array is empty!";
    let r:BubbleSortResultType = { steps: [] };

    // multiplier for ascending/descending sort
    let mul = descending ? 1 : -1;

    // flag for if a swap happened in one whole iteration
    let swapped = false;
    let sorted:number[] = [];
    let swapCount = 0;
    let ids = [...Array(arr.length).keys()];
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
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
 * @param arr array of numbers
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
function insertionSort(arr:number[]) {
    if (arr.length <= 1) return "Array is empty!";

    let r:InsertionSortResultType = { steps: [] };
    let sorted:number[] = [];
    let swapCount = 0;
    let ids = [...Array(arr.length).keys()];

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
    let p = 1;
    let i = 1;
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
 * @param arr array of numbers
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
function selectionSort(arr:number[]) {
    if (arr.length <= 1) return "Array is empty!";

    let r:SelectionSortResultType = { steps: [] };
    let sorted:number[] = [];
    let swapCount = 0;
    let ids = [...Array(arr.length).keys()];
    let minI = 0;
    for (let i = 0; i < arr.length; i++) {
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
        for (let j = i + 1; j < arr.length; j++) {
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

type Position = {
    level: number,
    treePos: number,
    pos: number
}

function mergeSort(arr:number[]) {
    if (arr.length <= 1) return "Array is empty!";

    let r:MergeSortResultType = { steps: [], compareCount: 0 };
    let positions:Position[] = [];
    let ids = [...Array(arr.length).keys()];

    for (let i = 0; i < arr.length; i++) {
        positions[i] = {
            level: 0,
            treePos: 0,
            pos: i,
        };
    }

    r.steps.push({
        positions: copyOject(positions) as Position[],
        highlight: [],
        compareCount: r.compareCount,
        description: "Starting merge sort...",
        swapped: false,
        sorted: false,
        comparing: false
    });

    mergeSortHelper(arr, ids, r, positions, 0, 0);

    r.steps.push({
        positions: copyOject(positions) as Position[],
        highlight: [],
        compareCount: r.compareCount,
        sorted: true,
        description: "Array is sorted!",
        swapped: false,
        comparing: false
    });

    return r;
}

function mergeSortHelper(arr:number[], ids:number[], r:MergeSortResultType, positions:Position[], level: number, treePos:number) {
    let n = ids.length;
    if (n == 1) return ids;

    // split array to two halfs
    let mid = Math.floor(n / 2);
    let ids1 = ids.slice(0, mid);
    let ids2 = ids.slice(mid, n);

    // adding step
    fillSubarrayPositions(ids1, ids2, positions, level, treePos);
    let step = {
        positions: copyOject(positions) as Position[],
        highlight: ids1.concat(ids2),
        compareCount: r.compareCount,
        description: `Splitting array into subarrays...`,
        swapped: false,
        sorted: false,
        comparing: false
    };
    r.steps.push(step);

    // in the case of only 2 elements, split and merge is redundant
    if (ids1.length > 1 || ids2.length > 1) {
        // split themselves
        ids1 = mergeSortHelper(
            arr,
            ids1,
            r,
            positions,
            level + 1,
            2 * treePos + 1
        );
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
            positions: copyOject(positions) as Position[],
            highlight: ids1.concat(ids2),
            compareCount: r.compareCount,
            description: `Merging subarrays...`,
            swapped: false,
            sorted: false,
            comparing: false
        };
        r.steps.push(step);
    }

    // merge them together
    return mergeHelper(arr, ids1, ids2, r, positions, level, treePos);
}

function mergeHelper(arr:number[], ids1:number[], ids2:number[], r:MergeSortResultType, positions:Position[], level:number, treePos:number) {
    let ids3:number[] = [];

    // compare and add the front element of each array until one is empty
    while (ids1.length > 0 && ids2.length > 0) {
        // add step for comparing
        fillSubarrayPositions(ids1, ids2, positions, level, treePos);
        let step = {
            positions: copyOject(positions) as Position[],
            highlight: [ids1[0], ids2[0]],
            comparing: true,
            compareCount: r.compareCount,
            description: `Comparing ${arr[ids1[0]]} and ${arr[ids2[0]]}...`,
            swapped: false,
            sorted: false,
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
            positions: copyOject(positions) as Position[],
            highlight: highlighted,
            swapped: true,
            compareCount: r.compareCount,
            description: description,
            sorted: false,
            comparing: false
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
    let step = {
        positions: copyOject(positions) as Position[],
        highlight: ids3,
        compareCount: r.compareCount,
        description: description,
        swapped: false,
        sorted: false,
        comparing: false
    };
    r.steps.push(step);

    return ids3;
}

function fillSubarrayPositions(ids1:number[], ids2:number[], positions:Position[], level:number, treePos:number) {
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

function copyOject(obj:Object):Object {
    return JSON.parse(JSON.stringify(obj));
}

//----------------------------------QUICK SORT----------------------------------------------

// QuickSortResultType

// steps: {
//     array: number[];
//     subArrayStartIndex: number; // color this
//     subArrayEndIndex: number; // color this
//     leftPointer: number;
//     rightPointer: number;
//     sorted: boolean; // low priority on coloring
//     swapped: boolean; //  low priority on coloring
//     swapCount: number;
//     description: string;
//     pivotIndex: number; // color this
// }[];

function quickSort(arr: number[]) {
    if (arr.length <= 1) return "Array is empty or single-element array!";

    let result: QuickSortResultType = { steps: [] }
    let swapCount = 0;
    let ids = [...Array(arr.length).keys()];
    let stack: number[] = [];

    quickSortResultBuilder(result, [...ids], arr, 0, arr.length - 1, -1, -1, false, false, swapCount, "Starting quick sort...", -1)

    // Choosing the front and back pointer indexes before sorting
    stack.push(0);
    stack.push(arr.length - 1);

    // now, let's iterate through each subarray option by pulling each subarray's front/end index
    // and using that to reference the subarray
    while (stack.length > 0) {
        let end: number = stack.pop()!;
        let start: number = stack.pop()!;

        // starts the partition and swapping process to sort the subarray by the pivot
        let pivotIndex = quickSortPartition(result, ids, swapCount, arr, start, end);

        // splitting into more subarrays if there's more splitting necessary
        if (start !== undefined && pivotIndex - 1 > start) {
            stack.push(start);
            stack.push(pivotIndex - 1);
            quickSortResultBuilder(result, [...ids], arr, start, end, -1, -1, false, false, swapCount, "Decrement right pointer by one and create left subarray", pivotIndex)
        } else {
            quickSortResultBuilder(result, [...ids], arr, start, end, -1, -1, false, false, swapCount, "No more left subarray splitting is possible", pivotIndex)
        }

        if (pivotIndex !== undefined && pivotIndex + 1 < end) {
            stack.push(pivotIndex + 1);
            stack.push(end);
            quickSortResultBuilder(result, [...ids], arr, start, end, -1, -1, false, false, swapCount, "Increment left pointer by one and create right subarray", pivotIndex)
        } else {
            quickSortResultBuilder(result, [...ids], arr, start, end, -1, -1, false, false, swapCount, "No more right subarray splitting is possible", pivotIndex)
        }
    }
    return result;
}

function quickSortPartition(result: QuickSortResultType, ids:number[], swapCount: number, arr: number[], start: number, end: number) {
    let pivotIndex = start;
    let pivotValue = arr[end];

    quickSortResultBuilder(result, [...ids], arr, start, end, start, start, false, false, swapCount, `Choosing pivot: ${pivotValue}`, end);

    for (let i = start; i < end; i++) {
        quickSortResultBuilder(result, [...ids], arr, start, end, pivotIndex, i, false, false, swapCount, `Comparing ${arr[i]} and ${arr[pivotIndex]}`, end);
        if (arr[i] < pivotValue) {
            // swap left and right pointers to align with sorting by pivot and Update ids state.
            [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
            [ids[i], ids[pivotIndex]] = [ids[pivotIndex], ids[i]];
            quickSortResultBuilder(result, [...ids], arr, start, end, pivotIndex, i, false, false, swapCount, `${arr[i]} < ${arr[pivotIndex]}! Swapping: ${arr[i]} and ${arr[pivotIndex]}`, end);
            // increment and log pivotIndex
            pivotIndex++;
            quickSortResultBuilder(result, [...ids], arr, start, end, pivotIndex, i, false, true, swapCount, `Incrementing left pointer by one`, end);
        } else {
            quickSortResultBuilder(result, [...ids], arr, start, end, pivotIndex, i, false, false, swapCount, `${arr[i]} < ${arr[pivotIndex]}, continue incrementing right pointer`, end);
        }
    }
    // the pivotIndex represents where the pivot value should belong to retain sorting by pivot
    [arr[pivotIndex], arr[end]] = [arr[end], arr[pivotIndex]];
    quickSortResultBuilder(result, [...ids], arr, start, end, pivotIndex, end, false, true, swapCount, `Swap pivot with left pointer to finish partitioning by ${pivotValue}`, pivotIndex);
    return pivotIndex;
}

function quickSortResultBuilder(
        result: QuickSortResultType, array: number[], sortedArray: number[],
        subArrayStartIndex: number, subArrayEndIndex: number,
        leftPointer: number, rightPointer: number,
        sorted: boolean, swapped: boolean,
        swapCount: number,description: string,
        pivotIndex: number
    ) {
        result.steps.push({
            array: array,
            sortedArray: sortedArray,
            subArrayStartIndex: subArrayStartIndex, // color this
            subArrayEndIndex: subArrayEndIndex, // color this
            leftPointer: leftPointer,
            rightPointer: rightPointer,
            sorted: sorted, // low priority on coloring
            swapped: swapped, //  low priority on coloring
            swapCount: swapCount,
            description: description,
            pivotIndex: pivotIndex, // color this
        });
}


//-----------------------------------------------------------------------------------------

export {
    bubbleSort,
    insertionSort,
    selectionSort,
    mergeSort,
    quickSort,
};
