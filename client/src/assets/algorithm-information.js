export const linearSearchDesc = {
    algorithm: "Linear Search",
    title: "Linear search checks each element of the list until a match is found or the whole list is exhausted",
    description: [
        "Worst Time Complexity: O(n)",
        "In Practice Complexity: O(n)",
        "Best Complexity: O(1)",
        "Space Complexity: O(1)",
    ],
};
export const binarySearchDesc = {
    algorithm: "Binary Search",
    title: "Binary search finds the position of a target value within a sorted array by comparing the target value to the middle element of the array.",
    description: [
        "Worst Time Complexity: O(log(n))",
        "In Practice Complexity: O(log(n))",
        "Best Complexity: O(1)",
        "Space Complexity: O(1)",
    ],
};
export const bubbleSortDesc = {
    algorithm: "Bubble Sort",
    title: "Bubble Sort compares adjacent elements and swaps them if they are in the wrong order",
    description: [
        "Worst Time Complexity: O(n^2)",
        "In Practice Complexity: O(n^2)",
        "Best Complexity: O(n)",
        "Space Complexity: O(1)",
        "Stable: Yes",
        "In-place: Yes",
    ],
};
export const insertionSortDesc = {
    algorithm: "Insertion Sort",
    title: "Insertion sort builds a final sorted array one at a time by taking one entry from the unsorted partition and placing it in the sorted partition",
    description: [
        "Worst Time Complexity: O(n^2)",
        "In Practice Complexity: O(n^2)",
        "Best Complexity: O(n)",
        "Space Complexity: O(1)",
        "Stable: Yes",
        "In-place: Yes",
    ],
};
export const selectionSortDesc = {
    algorithm: "Selection Sort",
    title: "Selection Sort is an in-place sorting algorithm that selects the smallest element of an unsorted list and places it in the beginning of the unsorted partition",
    description: [
        "Worst Time Complexity: O(n^2)",
        "In Practice Complexity: O(n^2)",
        "Best Complexity: O(n^2)",
        "Space Complexity: O(1)",
        "Stable: No",
        "In-place: Yes",
    ],
};

export const mergeSortDesc = {
    algorithm: "Merge Sort",
    title: "Merge Sort is a divide and conquer algorithm that recursively divides the array in half to the smallest subarrays, then gradually sorts and merges adjacent subarrays until it reaches the original array size.",
    description: [
        "Worst Time Complexity: O(nlog(n))",
        "In Practice Complexity: O(nlog(n))",
        "Best Complexity: O(nlog(n))",
        "Space Complexity: O(n)",
        "Stable: Yes",
        "In-place: No",
    ],
};

export const depthFirstSearchDesc = {
    algorithm: "Depth First Search",
    title: "Depth-first search is an algorithm for traversing or searching tree or graph data structures. The algorithm starts at a node and explores as far as possible along each branch before backtracking. Extra memory, usually a stack, is needed to keep track of the nodes discovered so far along a specified branch which helps in backtracking of the graph.",
    description: [
        "Worst Time Complexity: O(|Vertices| + |Edges|)",
        "Space Complexity: O(|Vertices|)",
    ],
};

export const breadthFirstSearchDesc = {
    algorithm: "Breadth First Search",
    title: "Breadth-first search is an algorithm for traversing or searching tree or graph data structures. The algorithm starts at a node, records all of its adjacent nodes, and then explores down each of the adjacent nodes and repeats the process of recording the adjacent nodes of the next layer. Visually, breadth-first search explores the nodes in a graph layer by layer. Extra memory, usually a queue, is needed to keep track of the nodes discovered in each layer, which helps with going to the next layer of the graph during traversal.",
    description: [
        "Worst Time Complexity: O(|Vertices| + |Edges|)",
        "Space Complexity: O(|Vertices|)",
    ],
};

export const bucketSortDesc = {
    algorithm: "Bucket Sort",
    title: "Bucket sort, or bin sort, is a sorting algorithm that works by distributing the elements of an array into a number of buckets.",
    description: [
        "Worst Time Complexity: O(n^2)",
        "In Practice Complexity: O(n + k)",
        "Best Complexity: O(n + k)",
        "Space Complexity: O(n + k)",
        "Stable: Yes",
        "In-place: No",
    ],
};