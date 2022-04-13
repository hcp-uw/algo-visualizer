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
                description: `Comparing index ${j}(=${
                    arr[ids[j]]
                }) and index ${j}(=${arr[ids[j + 1]]})`,
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
                description: `Current element is less than the preceding one (${
                    arr[ids[p]]
                }<${arr[ids[p - 1]]}). Swapping index ${p} and ${p - 1}`,
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

module.exports = {
    bubbleSort,
    insertionSort,
    selectionSort,
};
