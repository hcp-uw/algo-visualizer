// return random integer in range
const randInt = (min, max) => min + Math.floor(Math.random() * max);
// return deep copy of object
const copyObject = (object) => JSON.parse(JSON.stringify(object));

export { randInt, copyObject };
