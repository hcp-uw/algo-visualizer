type LinearSearchResultType = {
    steps: {
        element: number,
        description: string
    }[],
    foundIndex: number,
    success: boolean,
    target: number
};

type BinarySearchResultType = {
    steps: {
        step: number,
        l: number,
        r: number,
        description: string
    }[],
    foundIndex: number,
    success: boolean,
    target: number
};

type BubbleSortResultType = {
    steps: {
        array: number[],
        highlight: number[],
        sorted: number[],
        swapped: boolean,
        swapCount: number,
        description: string
    }[]
}

type InsertionSortResultType = BubbleSortResultType;

type SelectionSortResultType = {
    steps: {
        array: number[],
        highlight: number[],
        sorted: number[],
        swapped: boolean,
        swapCount: number,
        min: number, 
        description: string
    }[]
}

type MergeSortResultType = {
    steps: {
        compareCount: number,
        description: string,
        highlight: number[],
        comparing: boolean,
        swapped: boolean,
        sorted: boolean,
        positions: {
            level: number,
            treePos: number,
            pos: number
        }[]
    }[],
    compareCount: number
}

type AlgorithmResultType = LinearSearchResultType | BinarySearchResultType | BubbleSortResultType
 | InsertionSortResultType | SelectionSortResultType | MergeSortResultType;

export { LinearSearchResultType, BinarySearchResultType
    , BubbleSortResultType, InsertionSortResultType
    , SelectionSortResultType, MergeSortResultType
    , AlgorithmResultType };