/**
 * Sort algorithms will take an array of (numbers/objects) as the elements to perform algorithm.
 * The output will be an object containing the steps.
 * 
 * The steps array contains the objects about the order of array and sorted/unsorted region
 * at any given step.
 * 
 * INPUT:    array: Array(Numbers/Objects). Eg.: [1,2,3,4,5,6,7]
 * OUTPUT:   Object in format
 *              {
 *                  steps:      Array(Object) 
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
    var t = array[i]
    array[i] = array[j]
    array[j] = t
}

function bubbleSort(arr, descending=false) {
    if (arr.length <= 1)
        return;
    var r = { steps: [] };
    
    // multiplier for ascending/descending sort
    var mul = descending ? 1 : -1;
    
    // flag for if a swap happened in one whole iteration
    var swapped = true;
    var sorted = [];
    var swapCount = 0;
    var ids = [...Array(arr.length).keys()];
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr.length-1-i; j++) {
            r.steps.push({ array: [...ids], highlight: [ids[j], ids[j+1]], sorted: [...sorted], swapped: false, swapCount: swapCount});
            // compare with the next element
            if ((arr[ids[j+1]] - arr[ids[j]])* mul > 0) {
                swap(ids, j, j+1);
                swapped = true;
                swapCount++;
                r.steps.push({ array: [...ids], highlight: [ids[j], ids[j+1]], sorted: [...sorted], swapped: true, swapCount: swapCount});
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
                sorted.push(ids[arr.length-1-i]);
            }
        }
        r.steps.push({ array: [...ids], highlight: [], sorted: [...sorted], swapped: false, swapCount: swapCount});
    }

    return r;
}

function insertionSort(arr) {
    if (arr.length <= 1)
        return;

    var r = { steps: [] };
    var sorted = [];
    var swapCount = 0;
    var ids = [...Array(arr.length).keys()];

    var p = 0;
    var i = 0;
    while (i < arr.length) {
        r.steps.push({ array: [...ids], highlight: [ids[p]], sorted: [...sorted], swapped: false, swapCount: swapCount});
        while (p > 0 && arr[ids[p]] < arr[ids[p-1]]) {
            swap(ids, p, p-1);
            swapCount++;
            r.steps.push({ array: [...ids], highlight: [ids[p], ids[p-1]], sorted: [...sorted], swapped: true, swapCount: swapCount});
            p--;
        }
        sorted.push(ids[p]);
        r.steps.push({ array: [...ids], highlight: [], sorted: [...sorted], swapped: false, swapCount: swapCount});
        i++;
        p = i;
    }
    return r;
}

module.exports = {
    bubbleSort,
    insertionSort
}