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

/**
 * Heap sort. Build the sorted array by putting all values in a heap in any order,
 * then removing the minimum value from the heap until the heap is empty.
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
 function heapSort(arr) {
    if (arr.length <= 1) return;

    var r = { steps: [] };
    var heap = [];
    var heapIds = [];
    var sorted = [];
    var swapCount = 0;
    var ids = [...Array(arr.length).keys()];

    let swapHeapVals = (idx1, idx2) => {
        swap(heap, idx1, idx2);
        swap(heapIds, idx1, idx2);
        swapCount++;
    }

    let swapDown = (idx1, idx2) => {
        swapHeapVals(idx1, idx2);
        r.steps.push({
            array: [...ids],
            heap: [...heapIds],
            highlight: [heapIds[idx1], heapIds[idx2]],
            sorted: [...sorted],
            swapped: true,
            swapCount: swapCount,
            description:
                `Filter index ${idx1} down`,
        });
    }

    let swapUp = (idx1, idx2) => {
        swapHeapVals(idx1, idx2);

        r.steps.push({
            array: [...ids],
            heap: [...heapIds],
            highlight: [heapIds[idx1], heapIds[idx2]],
            sorted: [...sorted],
            swapped: true,
            swapCount: swapCount,
            description:
                `Filter index ${idx1} up`,
        });
    }

    let filterDown = (idx) => {
        if (idx < heap.length) {
            if (2 * idx + 1 < heap.length && 2 * idx + 2 < heap.length) {
                if (heap[2 * idx + 1] <= heap[2 * idx + 2 ]) {
                    if (heap[2 * idx + 1] < heap[idx]) {
                        swapDown(idx, 2 * idx + 1);
                        filterDown(2 * idx + 1);
                    }
                } else if (heap[2 * idx + 2] < heap[idx]) {
                    swapDown(idx, 2 * idx + 2);
                    filterDown(2 * idx + 2);
                }
            } else if (2 * idx + 1 < heap.length && heap[2 * idx + 1] < heap[idx]) {
                swapDown(idx, 2 * idx + 1);
                filterDown(2 * idx + 1);
            }
        }
    }

    let filterUp = (idx) => {
        var p = Math.floor((idx - 1) / 2);
        if (idx > 0 && heap[idx] < heap[p]) {
            swapUp(idx, p);
            filterUp(p);
        }
    }

    let addToHeap = (val, id) => {
        heap.push(val);
        heapIds.push(id);
        r.steps.push({
            array: [...ids],
            heap: [...heapIds],
            highlight: [ids[0]],
            sorted: [...sorted],
            swapped: false,
            swapCount: swapCount,
            description:
                `Sorting ${val}`,
        });
        filterUp(heap.length - 1);
    }

    let heapRemoveMin = () => {
        var minId = heapIds[0];
        heap[0] = heap.splice(heap.length - 1, 1)[0];
        heapIds[0] = heapIds.splice(heapIds.length - 1, 1)[0];
        filterDown(0);
        return minId;
    }

    // Step 1: Add all values to the heap
    for (var i = 0; ids.length > 0; i++) {
        var id = ids[0];
        r.steps.push({
            array: [...ids],
            heap: [...heapIds],
            highlight: [id],
            sorted: [...sorted],
            swapped: false,
            swapCount: swapCount,
            description:
                `Moving ${arr[id]} to the heap`,
        });
        addToHeap(arr[id], id);
        sorted.push(id);
        ids.splice(0, 1);
    }

    // Values will be in the heap
    r.steps.push({
        array: [...ids],
        heap: [...heapIds],
        highlight: [],
        sorted: [...sorted],
        swapped: false,
        swapCount: swapCount,
        description:
            `All values sorted in the heap`,
    });

    // Step 2: Remove all values from the start of the heap
    while (heapIds.length > 1) {
        r.steps.push({
            array: [...ids],
            heap: [...heapIds],
            highlight: [heapIds[0]],
            sorted: [...sorted],
            swapped: false,
            swapCount: swapCount,
            description:
                `Adding the heap minimum back into the array`,
        });
        ids.push(heapRemoveMin());
    }

    // Push the last couple steps
    r.steps.push({
        array: [...ids],
        heap: [...heapIds],
        highlight: [heapIds[0]],
        sorted: [...sorted],
        swapped: false,
        swapCount: swapCount,
        description:
            `Adding the heap minimum back into the array`,
    });

    ids.push(heapRemoveMin());

    r.steps.push({
        array: [...ids],
        heap: [...heapIds],
        highlight: [heapIds[0]],
        sorted: [...sorted],
        swapped: false,
        swapCount: swapCount,
        description:
            `Adding the heap minimum back into the array`,
    });

    return r;
}

module.exports = {
    bubbleSort,
    insertionSort,
    selectionSort,
    heapSort,
};
