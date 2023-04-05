const {
    bubbleSort,
    insertionSort,
    selectionSort,
    mergeSort,
    quickSort,
} = require("./sorts");

const BASE_CASE = [
    70, 63, 66, 28, 51, 18, 3, 79, 5, 88, 11, 37, 22, 94, 25, 32, 30, 89, 92, 7,
];

const ODD_NUM_ELEMENTS = [
    53, 37, 11, 17, 6, 56, 75, 0, 61, 94, 91, 51, 5, 58, 36, 100, 74, 27, 92,
];

const INCLUDE_DUPS_CASE = [
    41, 21, 83, 87, 41, 4, 55, 74, 68, 5, 82, 35, 21, 13, 43, 84, 55, 46, 15,
    69,
];

const SORTED_CASE = [
    6, 9, 14, 19, 21, 25, 30, 35, 44, 49, 54, 55, 61, 66, 72, 73, 81, 82, 83,
    85,
];
const INCLUDE_NEGATIVES_CASE = [
    -38, 53, -30, 7, 93, -69, 59, 28, -76, -31, 100, 94, 96, -71, -84, -13, -86,
    42, 9, -90,
];

const FLOATS_CASE = [
    -40.920500852221366, 96.19051295461537, -12.61444395832818,
    -46.23761623320854, -85.9087652512756, 30.830691911619596,
    -85.87375512168722, -94.99374152716844, -36.75450640409594,
    64.53462876621319, -26.1688503501301, -62.566765776111446,
    71.84631029240771, -47.25733477451506, 65.72867150738736,
    14.506316668999503, 74.71946711471963, -7.003206551445544,
    -85.35118750972903, 47.72154920373214, 22, 0,
];

// 500 elements
const MEDIUM_CASE = [
    -93, -83, -69, 9, -99, -97, -43, 94, -47, -91, -30, -18, 40, -58, 54, 25, 4,
    49, 48, 88, 50, 30, 81, 24, 74, -26, -45, -99, 7, -100, -77, -1, 31, -49,
    -34, 34, 72, -90, 69, -94, 19, 28, 41, -6, -41, -72, 78, -59, 99, 31, -93,
    -82, 72, -42, 23, -99, 100, 22, 59, 46, -91, -7, 58, -43, -78, -9, -43, 0,
    -7, -85, -90, 75, -95, 34, -26, -52, -8, -79, 67, 69, -64, -11, 100, 39,
    -11, -68, 18, -40, -43, -42, -57, -65, -82, -18, -90, 40, -68, -4, 81, 46,
    55, 68, -6, -96, -97, -77, -40, -69, -78, -26, -84, 26, 73, 37, 47, 34, 28,
    -71, -50, -55, -4, 55, 93, 53, -44, -37, -72, -4, -13, 27, 38, 8, 25, 82,
    -31, -85, -15, -88, -40, 3, -92, -76, 57, 35, -81, -68, 1, 52, -86, 34, -59,
    -88, -95, -63, 24, 76, -91, 16, 88, -13, -87, -74, -51, 0, -93, 48, -82,
    -23, -89, -79, -14, -18, -26, -74, 69, 94, 97, 72, 37, -69, 11, 89, -9, -72,
    83, -73, -38, 17, -24, 50, -79, 76, -25, -19, -61, 44, -16, 75, 62, 27, 25,
    35, -23, 43, -51, 69, 94, 44, -46, -34, 42, -70, -21, 64, -17, 44, -52, 57,
    -54, -89, -77, 64, -22, 95, 80, -63, 81, -19, -99, -75, -99, -78, -40, -43,
    -93, 83, 47, -82, -68, 94, 18, -15, 88, -82, -26, -54, 19, -20, 4, 69, 99,
    -38, -83, -57, -99, -46, -18, -17, 5, 18, -15, -99, 14, 11, -13, -49, -75,
    -21, -86, -18, -77, -47, -86, -73, -38, -36, -65, -79, 11, -98, -96, -85, 0,
    -51, 65, 64, 3, 88, -69, 84, 97, 81, -58, -25, -87, -45, 54, 33, 81, -56,
    79, 6, 74, 90, -2, 71, 11, 54, -98, 89, -14, 61, -98, 76, 84, 60, 92, 66,
    67, 91, 8, 7, -61, -64, 99, -26, 72, -60, -15, 96, -95, -33, -17, -21, 98,
    -48, 64, -89, 59, 40, 78, -88, 27, 100, -6, -62, 61, -33, -96, 52, 51, -84,
    -58, -16, -29, -99, -80, -7, -69, -20, 57, 84, -23, 29, 33, 55, 11, -29, 86,
    50, 46, -80, 57, -63, 29, 28, 54, 16, 14, 1, 69, 64, -74, -57, 54, -46, -58,
    -29, -21, 60, 52, 39, 14, -37, -14, 89, -85, 96, -90, 73, 29, -32, -48, -14,
    -64, -41, -16, 42, 91, -23, 31, -10, 1, -96, 100, 63, -44, 93, -68, 47, 16,
    -33, -37, 31, -86, -11, 56, 61, -64, 33, -6, -4, -80, -12, 13, 36, 26, 48,
    -54, 25, -48, -46, -34, 44, 81, -31, -31, 30, 89, -79, -96, -63, 85, -45,
    -98, -91, -76, 16, 84, -53, 42, -75, -38, 80, 53, -80, 47, 1, 8, 92, -54,
    62, 28, 95, -21, -53, -27, -78, -33, 45, 35, -33, 11, 71, -27, 37, 17, -54,
    99, -47, 50, 55, -12, 66, -65, 82, 68, 73, -100, 49,
];
/**
 * fetch the result from the result json
 * and check if the result is sorted in ascending order
 *
 * this is to reduce code repetition
 */
const standardTest = (algorithm, arr) => {
    let result = algorithm(arr);
    result = result.steps[result.steps.length - 1].array;

    // check if element is no more than the next
    for (let i = 0; i < result.length - 1; i++) {
        expect(arr[result[i]]).toBeLessThanOrEqual(arr[result[i + 1]]);
    }
};

const mergeSortTest = (arr) => {
    let result = mergeSort(arr);
    // the last step here is an array of positions of the original elements
    result = result.steps[result.steps.length - 1].positions;

    let newArr = Array(arr.length);
    for (let i = 0; i < arr.length; i++) {
        newArr[result[i].pos] = arr[i];
    }

    // check if element is no more than the next
    for (let i = 0; i < newArr.length - 1; i++) {
        expect(newArr[i]).toBeLessThanOrEqual(newArr[i + 1]);
    }
};

test("Bubble Sort base cases", () => {
    // base case
    standardTest(bubbleSort, BASE_CASE);

    // test descending option
    let result = bubbleSort(BASE_CASE, true);
    result = result.steps[result.steps.length - 1].array;

    for (let i = 0; i < result.length - 1; i++) {
        expect(BASE_CASE[result[i]]).toBeGreaterThanOrEqual(
            BASE_CASE[result[i + 1]]
        );
    }
});

test("Bubble Sort edge cases", () => {
    // empty array
    expect(bubbleSort([])).toEqual("Array is empty!");

    // sorted array case
    standardTest(bubbleSort, SORTED_CASE);

    // array with duplicate values case
    standardTest(bubbleSort, INCLUDE_DUPS_CASE);

    // array with negative values case
    standardTest(bubbleSort, INCLUDE_NEGATIVES_CASE);

    // array with float values case
    standardTest(bubbleSort, FLOATS_CASE);

    // array with medium amount of elements case
    standardTest(bubbleSort, MEDIUM_CASE);
});

test("Insertion Sort base cases", () => {
    // base case
    standardTest(insertionSort, BASE_CASE);
});

test("Insertion Sort edge cases", () => {
    // empty array
    expect(insertionSort([])).toEqual("Array is empty!");

    // sorted array case
    standardTest(insertionSort, SORTED_CASE);

    // array with duplicate values case
    standardTest(insertionSort, INCLUDE_DUPS_CASE);

    // array with negative values case
    standardTest(insertionSort, INCLUDE_NEGATIVES_CASE);

    // array with float values case
    standardTest(insertionSort, FLOATS_CASE);

    // array with medium amount of elements case
    standardTest(insertionSort, MEDIUM_CASE);
});

test("Selection Sort base cases", () => {
    // base case
    standardTest(selectionSort, BASE_CASE);
});

test("Selection Sort edge cases", () => {
    // empty array
    expect(selectionSort([])).toEqual("Array is empty!");

    // sorted array case
    standardTest(selectionSort, SORTED_CASE);

    // array with duplicate values case
    standardTest(selectionSort, INCLUDE_DUPS_CASE);

    // array with negative values case
    standardTest(selectionSort, INCLUDE_NEGATIVES_CASE);

    // array with float values case
    standardTest(selectionSort, FLOATS_CASE);

    // array with medium amount of elements case
    standardTest(selectionSort, MEDIUM_CASE);
});

test("Merge Sort base cases", () => {
    // base case
    mergeSortTest(BASE_CASE);

    // odd number of elements case
    mergeSortTest(ODD_NUM_ELEMENTS);
});

test("Merge Sort edge cases", () => {
    // empty array
    expect(mergeSort([])).toEqual("Array is empty!");

    // sorted array case
    mergeSortTest(SORTED_CASE);

    // array with duplicate values case
    mergeSortTest(INCLUDE_DUPS_CASE);

    // array with negative values case
    mergeSortTest(INCLUDE_NEGATIVES_CASE);

    // array with float values case
    mergeSortTest(FLOATS_CASE);

    // array with medium amount of elements case
    mergeSortTest(MEDIUM_CASE);
});

test("Quick Sort base cases", () => {
    // base case
    standardTest(quickSort, BASE_CASE);
    // (pass! 🟢)
});

test("Quick Sort edge cases", () => {
    // empty array
    expect(quickSort([])).toEqual("Array is empty or single-element array!");

    // sorted array case (pass!)
    standardTest(quickSort, SORTED_CASE);

    // array with negative values case (pass!)
    standardTest(quickSort, INCLUDE_NEGATIVES_CASE);

    // array with float values case
    standardTest(quickSort, FLOATS_CASE);

    // array with duplicate values case
    standardTest(quickSort, INCLUDE_DUPS_CASE);

    // array with medium amount of elements case
    standardTest(quickSort, MEDIUM_CASE);

})

function testSortOnly(algorithm, arr) {
    let sortedArr = algorithm(arr);
    for (let i = 0; i < sortedArr.length - 1; i++) {
        expect(sortedArr[i]).toBeLessThanOrEqual(sortedArr[i + 1]);
    }
}