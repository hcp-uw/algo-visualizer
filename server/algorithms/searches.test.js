const { linearSearch, binarySearch } = require("./searches");

test("Linear Search basic case", () => {
    // a success case
    let array = [1, 2, 3];
    let target = 2;
    let searchResult = linearSearch(array, target);

    expect(searchResult.success).toBeTruthy();
    expect(searchResult.foundIndex).toBe(1);
    expect(searchResult.steps[searchResult.steps.length - 1].description).toBe(
        "Element found at index 1!"
    );

    // a fail case
    array = [2, 5, 4];
    target = 3;
    searchResult = linearSearch(array, target);

    expect(searchResult.success).toBeFalsy();
    expect(searchResult.foundIndex).toBe(-1);
    expect(searchResult.steps[searchResult.steps.length - 1].description).toBe(
        "Element not found!"
    );
});

test("Linear Search edge cases", () => {
    // case: empty array
    // expect: search runs and return the same result as a false case
    let array = [];
    let target = 3;
    let searchResult = linearSearch(array, target);

    expect(searchResult.success).toBeFalsy();
    expect(searchResult.foundIndex).toBe(-1);

    // case: duplicate elements
    // expect: return the first element
    array = [1, 5, 3, 2, 6, 2, 2];
    target = 2;
    searchResult = linearSearch(array, target);

    expect(searchResult.success).toBeTruthy();
    expect(searchResult.foundIndex).toBe(3);
});

test("Binary Search basic case", () => {
    // a success case
    let array = [1, 2, 3];
    let target = 2;
    let searchResult = binarySearch(array, target);

    expect(searchResult.success).toBeTruthy();
    expect(searchResult.foundIndex).toBe(1);
    expect(searchResult.steps[searchResult.steps.length - 1].description).toBe(
        "Element found at index 1!"
    );

    // a fail case
    array = [2, 4, 5];
    target = 3;
    searchResult = binarySearch(array, target);

    expect(searchResult.success).toBeFalsy();
    expect(searchResult.foundIndex).toBe(-1);
    expect(searchResult.steps[searchResult.steps.length - 1].description).toBe(
        "Element not found!"
    );
});

test("Binary Search edge cases", () => {
    // case: empty array
    // expect: search runs and return the same result as a false case
    let array = [];
    let target = 3;
    let searchResult = binarySearch(array, target);

    expect(searchResult.success).toBeFalsy();
    expect(searchResult.foundIndex).toBe(-1);
    expect(searchResult.steps[searchResult.steps.length - 1].description).toBe(
        "Element not found!"
    );

    // case: unsorted array
    // expect: sort aborted message
    array = [1, 5, 3, 2, 6, 2];
    target = 2;
    searchResult = binarySearch(array, target);

    expect(searchResult.success).toBeFalsy();
    expect(searchResult.foundIndex).toBe(-1);
    expect(searchResult.steps[searchResult.steps.length - 1].description).toBe(
        "Array is not sorted! Search aborted"
    );

    // case: duplicate elements
    // expect: search performs normally, returned index does not depends on target's position in array
    array = [1, 2, 2, 4, 5, 5, 5];
    target = 2;
    searchResult = binarySearch(array, target);

    expect(searchResult.success).toBeTruthy();
    expect(searchResult.foundIndex).toBe(1);

    target = 5;
    searchResult = binarySearch(array, target);

    expect(searchResult.success).toBeTruthy();
    expect(searchResult.foundIndex).toBe(5);
});
