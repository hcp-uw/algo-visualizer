# AlgoViz - Backend JSON Format

This section presents some examples as well as explains the structure of the data returned from the Express backend for algorithms.

---

## The general format

JSONs returned from the backend always contain 1 key called `results`. This key contains at least another key `steps`, which is an array that contains steps of the algorithm in order from finish to end. In other words, `steps[0]` is the first step and `step[n-1]`is the final step of the algorithm.

The `results` key can contain extra keys depending on the algorithm, such as `success` (linear and binary search).

Each step in the `steps` array contains the information useful for the front end to highlight the algorithm, along with a `description` key.

---

### 1. Linear Search

Linear search is the most simple. Below is an extract of the returned JSON for finding an element not in the array.

<details>
<summary>Click to expand JSON</summary>

```json
{
    "result": {
        "steps": [
            {
                "element": 0,
                "description": "Checking index 0"
            },
            {
                "element": 1,
                "description": "Checking index 1"
            },
            {
                "element": 2,
                "description": "Checking index 2"
            },
            ...
            {
                "element": 14,
                "description": "Checking index 14"
            },
            {
                "element": -1,
                "description": "Element not found!"
            }
        ],
        "success": false
    }
}
```

Full JSON: https://pastebin.com/QPhFVhLU

</details>

The `element` key in each step is the current **index** of the original array that the algorithm is looking at. The last step is always -1, and the `success` key tells if the element is found in the array.

---

### 2. Binary Search

Below is the returned JSON for finding `74` in the array `[18,20,25,27,27,32,33,48,53,66,74,76,93,94,99]`.

<details>
<summary>Click to expand JSON</summary>

```json
{
    "result": {
        "steps": [
            {
                "step": 7,
                "l": 0,
                "r": 14,
                "description": "Checking middle element at index 7(=floor(0+14)/2)"
            },
            {
                "step": -2,
                "l": 8,
                "r": 14,
                "description": "Middle element is less than target (48<74). Moving left bound to index 8 (middle+1)"
            },
            {
                "step": 11,
                "l": 8,
                "r": 14,
                "description": "Checking middle element at index 11(=floor(8+14)/2)"
            },
            {
                "step": -2,
                "l": 8,
                "r": 10,
                "description": "Middle element is greater than target (76>74). Moving right bound to index 10 (middle-1)"
            },
            {
                "step": 9,
                "l": 8,
                "r": 10,
                "description": "Checking middle element at index 9(=floor(8+10)/2)"
            },
            {
                "step": -2,
                "l": 10,
                "r": 10,
                "description": "Middle element is less than target (66<74). Moving left bound to index 10 (middle+1)"
            },
            {
                "step": 10,
                "l": 10,
                "r": 10,
                "description": "Checking middle element at index 10(=floor(10+10)/2)"
            },
            {
                "step": -1,
                "l": 10,
                "r": 10,
                "description": "Element found at index 10!"
            }
        ],
        "success": true
    }
}
```

</details>

Similar to Linear Search, the `step` key in each step is the current **index** of the original array that the algorithm is looking at, and the last step is always -1, with a `success` key.

For Binary Search, the algorithm also keeps track of the left and right bound, and each step reports this information as the `l` and `r` keys respectively. Some `step` has the value of `-2`to signals that either the left or right bound is moving.

---

### 3. Bubble Sort

Below is an extract the returned JSON for sorting the array `[2,34,9,65,50,70,32,13,76,64,75,42,79,67,71]`.

<details>
<summary>Click to expand JSON</summary>

```json
{
    "result": {
        "steps": [
            {
                "array": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14],
                "highlight": [0,1],
                "sorted": [],
                "swapped": false,
                "swapCount": 0,
                "description": "Comparing index 0(=2) and index 1(=34)"
            },
            ...
            {
                "array": [0,2,7,6,1,11,4,9,3,13,5,14,10,8,12],
                "highlight": [],
                "sorted": [12,8,10,14,5,13,3,9,4,11,1,6,7,2,0],
                "swapped": false,
                "swapCount": 28,
                "description": "Index 0 is sorted"
            }
        ]
    }
}
```

</details>

Full JSON: https://pastebin.com/ghCrNc0Q

Bubble sort compares two elements adjacent elements and swaps them until the array is in order. This means every step focuses on at most two elements, thus the `highlight` key contains the **indexes** of the targetted elements. There are two cases when two elements are being highlighted: they are comparing each other or swapping. The `swapped` key is a boolean flag to mark if a swap is happening. Every swap increments the `swapCount`key by 1.

The `array` key contains an array of **indexes** of elements and reports the positions of each element in the original array at a given step. For example, if the original array is `[25,73,84,45,66]` and the last step has the `array` of `[2,1,3,0,4]`, the effective array at that step is `[84,73,45,25,66]`. Note that `array` has the same number of elements as the original array.

Each step also contains a `sorted` array which contains the **indexes** of sorted elements. For Bubble Sort, the last element of the unsorted partition is sorted after each iteration.

To reiterate, **all indexes of elements are their positions in the original array**. Here is an example at **step 70** of bubble sorting the

```
array [ 2,34, 9,65,50,70,32,13,76,64,75,42,79,67,71]
posit [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14]
```

![bubble sort example](https://i.imgur.com/p6801Mf.png)

The step object corresponding with this step is:

```json
{
    "array": [0, 2, 6, 7, 1, 4, 9, 3, 11, 5, 13, 14, 10, 8, 12],
    "highlight": [1, 4],
    "sorted": [12, 8, 10],
    "swapped": false,
    "swapCount": 23,
    "description": "Comparing index 4(=34) and index 5(=50)"
}
```

We see that the two elements being highlighted are `34` and `50`, corresponding to elements at positions `1` and `4` in the original array. Since this step is comparing these two values, the `swapped` key is _false_. The sorted elements are `75, 76, 79`, corresponding to elements at positions `10, 8, 12` in the original array, respectively.

---

### 4. Insertion Sort

Below is an extract the returned JSON for sorting the array `[88,90,50,27,98,48,60,68,97,1,11,53,61,86,40]`.

<details>
<summary>Click to expand JSON</summary>

```json
{
    "result": {
        "steps": [
            {
                "array": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
                "highlight": [],
                "sorted": [0],
                "swapped": false,
                "swapCount": 0,
                "description": "First element is sorted"
            },
            {
                "array": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
                "highlight": [1],
                "sorted": [0],
                "swapped": false,
                "swapCount": 0,
                "description": "Start inserting index 1 to the sorted partition"
            },
            ...
            {
                "array": [9, 10, 3, 14, 5, 2, 11, 6, 12, 7, 13, 1, 0, 8, 4],
                "highlight": [],
                "sorted": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
                "swapped": false,
                "swapCount": 61,
                "description": "Index 14 is now sorted"
            }
        ]
    }
}
```

</details>

Full JSON: https://pastebin.com/sp66EsFC

Insertion Sort's JSON format is the same as Bubble Sort. Check out the last section of Bubble Sort for more information.

---

### 5. Selection Sort

Below is an extract the returned JSON for sorting the array `[30,69,51,12,2,94,78,9,91,62,42,83,56,69,44]`.

<details>
<summary>Click to expand JSON</summary>

```json
{
    "result": {
        "steps": [
            {
                "array": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
                "highlight": [0],
                "sorted": [],
                "swapped": false,
                "swapCount": 0,
                "min": 0,
                "description": "Starting iteration #1. New minima is 30"
            },
            {
                "array": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
                "highlight": [1],
                "sorted": [],
                "swapped": false,
                "swapCount": 0,
                "min": 0,
                "description": "Checking index 1"
            },
            ...
            {
                "array": [4, 7, 3, 0, 10, 14, 2, 12, 9, 1, 13, 6, 11, 8, 5],
                "highlight": [],
                "sorted": [4, 7, 3, 0, 10, 14, 2, 12, 9, 1, 13, 6, 11, 8, 5],
                "swapped": false,
                "swapCount": 0,
                "min": -1,
                "description": "Index 14 is now sorted"
            }
        ]
    }
}
```

</details>

Full JSON: https://pastebin.com/Z4yGHY8Q

Insertion Sort at each iteration scans the unsorted partition of the array for the minimum value then put it at the start of the unsorted portion. Therefore, each step also keeps the `min`, which is the **index** of the minimum value up to that step.

Every other format is the same as Bubble Sort. Check out the section of Bubble Sort for more information.
