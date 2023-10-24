import { Edge } from "./CommonTypes";

type LinearSearchResultType = {
  steps: {
    element: number;
    description: string;
  }[];
  foundIndex: number;
  success: boolean;
  target: number;
};

type BinarySearchResultType = {
  steps: {
    step: number;
    l: number;
    r: number;
    description: string;
  }[];
  foundIndex: number;
  success: boolean;
  target: number;
};

type BubbleSortResultType = {
  steps: {
    array: number[];
    highlight: number[];
    sorted: number[];
    swapped: boolean;
    swapCount: number;
    description: string;
  }[];
};

type QuickSortResultType = {
  steps: {
    array: number[];
    sortedArray: number[];
    subArrayStartIndex: number; // color this
    subArrayEndIndex: number; // color this
    leftPointer: number;
    rightPointer: number;
    sorted: boolean;
    swapped: boolean; //  low priority on coloring
    swapCount: number;
    description: string;
    pivotIndex: number; // color this
  }[];
};

type InsertionSortResultType = BubbleSortResultType;

type SelectionSortResultType = {
  steps: {
    array: number[];
    highlight: number[];
    sorted: number[];
    swapped: boolean;
    swapCount: number;
    min: number;
    description: string;
  }[];
};

type MergeSortResultType = {
  steps: {
    compareCount: number;
    description: string;
    highlight: number[];
    comparing: boolean;
    swapped: boolean;
    sorted: boolean;
    positions: {
      level: number;
      treePos: number;
      pos: number;
    }[];
  }[];
  compareCount: number;
};

type DepthFirstSearchResultType = {
  steps: {
    stack: { id: string; from: string }[];
    currentNode: string[];
    visitedNodes: string[];
    visitedEdges: Edge[];
    description: string;
  }[];
  traversalResult: string[];
  startNode: string;
  targetNode?: string;
};

type BreadthFirstSearchResultType = {
  steps: {
    queue: { id: string; from: string }[];
    currentNode: string[];
    visitedNodes: string[];
    visitedEdges: Edge[];
    description: string;
  }[];
  traversalResult: string[];
  startNode: string;
  targetNode?: string;
};

// We most likely will need to have a weight as well for the priorityQueue
type DijkstraSearchResultType = {
  steps: {
    priorityQueue: { id: string; from: string; weight: number }[];
    currentNode: string[];
    visitedNodes: string[];
    visitedEdges: Edge[];
    description: string;
  }[];
  traversalResult: string[];
  startNode: string;
  targetNode?: string;
};

type SearchAlgorithmResultType =
  | LinearSearchResultType
  | BinarySearchResultType
  | DepthFirstSearchResultType
  | BreadthFirstSearchResultType
  | DijkstraSearchResultType;

type SortAlgorithmResultType =
  | BubbleSortResultType
  | InsertionSortResultType
  | SelectionSortResultType
  | MergeSortResultType
  | QuickSortResultType;

type AlgorithmResultType = SearchAlgorithmResultType | SortAlgorithmResultType;

export {
  AlgorithmResultType,
  BinarySearchResultType,
  BreadthFirstSearchResultType,
  BubbleSortResultType,
  DepthFirstSearchResultType,
  DijkstraSearchResultType,
  InsertionSortResultType,
  LinearSearchResultType,
  MergeSortResultType,
  QuickSortResultType,
  SearchAlgorithmResultType,
  SelectionSortResultType,
  SortAlgorithmResultType,
};
