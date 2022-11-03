/**  return random integer in range */
const randInt = (min:number, max:number):number => min + Math.floor(Math.random() * max);
/** return deep copy of object */ 
const copyObject = (object:object):object => JSON.parse(JSON.stringify(object));

/**
 * Return a random array of length 15, range 0-99, allows duplicate,
 * and NOT sorted by default
 */ 
const makeRandomArray = (sort:boolean = false, size:number = 15, max:number = 99):number[] => {
    let rands = [];
    let result = [];
    while (rands.length < size) {
        let n = Math.floor(Math.random() * max) + 1;
        rands.push(n);
    }
    if (sort) rands.sort((a, b) => a - b);

    for (let i = 0; i < size; i++) {
        result.push(rands[i]);
    }
    return result;
};

export { randInt, copyObject, makeRandomArray };
