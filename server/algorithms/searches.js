/**
 * Search algorithms will take an array of (numbers/objects) as the elements to perform algorithm.
 * The output will be an object containing the steps and a success flag.
 * 
 * INPUT:    array: Array(Numbers/Objects). Eg.: [1,2,3,4,5,6,7]
 *           value: Number/Object. The target value to search.
 * OUTPUT:   Object in format
 *              {
 *                  steps:      Array(Numbers)  
 *                  success:    boolean
 *              }
 */

/**
 * Search for value by going through the array
 * one-by-one in order.
 * 
 * @param {*} arr 
 * @param {*} target 
 * @returns r the result object
 */
function linearSearch(arr, target) {
    var r = { steps: [], success: false}

    for (var i = 0; i < arr.length; i++) {
        r.steps.push(i);
        if (arr[i] === target) {
            r.success = true;
            break;
        }
    }
    r.steps.push(-1); // mark the final step for highlight and stuff
    return r;
}

/**
 * The steps in binary search also return the left and right boundary
 * for extra visuals.
 */
function binarySearch(arr, target) {
    var result = { steps: [], success: false};
    var l = 0, r = arr.length-1;

    if (arr[l] > arr[r]) {
        return result;
    }

    while (l <= r) {
        var m = Math.floor((l+r)/2);
        result.steps.push({step: m, l: l, r: r});
        if (arr[m] === target) {
            l = m;
            r = m;
            result.success = true;
            break;
        }

        if (arr[m] < target) {
            l = m+1;
        } else {
            r = m-1;
        }
        result.steps.push({step: -2, l: l, r: r});
    }
    if (!result.success)
        result.steps.pop();
    result.steps.push({step: -1, l: l, r: r});
    return result;
}

module.exports = {
    linearSearch,
    binarySearch
}