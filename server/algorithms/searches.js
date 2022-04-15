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

/**
 * Search for value by going through the array
 * one-by-one in order.
 *
 * @param {*} arr
 * @param {*} target
 * @returns r the result object
 */
function linearSearch(arr, target) {
    var r = { steps: [], success: false };

    for (var i = 0; i < arr.length; i++) {
        r.steps.push({ element: i, description: `Checking index ${i}` });
        if (arr[i] === target) {
            r.success = true;
            break;
        }
    }
    // mark the final step for highlight and stuff
    r.steps.push({
        element: -1,
        description: r.success
            ? `Element found at index ${r.steps[r.steps.length - 1].element}!`
            : `Element not found!`,
    });
    return r;
}

/**
 * The steps in binary search also return the left and right boundary
 * for extra visuals.
 */
function binarySearch(arr, target) {
    var result = { steps: [], success: false };
    var l = 0,
        r = arr.length - 1;

    // array is not sorted
    if (arr[l] > arr[r]) {
        result.steps.push({
            step: -1,
            l: l,
            r: r,
            description: "Array is not sorted! Search aborted",
        });
        return result;
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
            ? `Element found at index ${
                  result.steps[result.steps.length - 1].step
              }!`
            : `Element not found!`,
    });
    return result;
}

module.exports = {
    linearSearch,
    binarySearch,
};
