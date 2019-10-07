// Reduce is one of the key operations we do JS arrays apart from Filter and Map
// This is a common example of finding some of all the nos in an array.

function reduce(array, combine, start) {
    let counter = start;
    for (let element of array){
    counter = combine(element, counter);
    }
    return counter;
}

console.log(reduce([1,2,3,4], (a,b) => a + b, 0));
console.log([1,2,3,4].reduce((a,b) => {return a + b}, 0));

// Finding the script with most number of chars

function characterCount(script){
    return script.ranges.reduce((count, [from, to]) => {
        return count + (to - from);
    }, 0);
}

// Doing kinda bubble sort here!
console.log(SCRIPTS.reduce((a, b) => {
    return characterCount(a) < characterCount(b) ? b : a;
}));

// Syntax of reduce method on arrays
// array.reduce(function( total, currentValue, currentIndex, arr), initialValue)
// it is mandatory to pass fx as argument when using reduce method 
// in the inner fx its mandatory to define total and currentValue!

// few more examples of application of reduce method!!

let someNumbers = [15.5, 2.3, 1.1, 4.7];
console.log("Sum of nos. in someNumbers array: " + 
  someNumbers.reduce((total, num) => total + num,0));

function average(array) {
    return array.reduce((a, b) => a + b) / array.length;
}

console.log("The average (using reduce method on array) of nos 1-5 is: " + 
  average([1,2,3,4,5]));

let intArray = [1,2,3,4,5];
let sum = 0;
for (element of intArray){
    sum += element;
}
console.log("The average (using standard programmatic way) of nos 1-5 is: " + 
  sum / intArray.length);

console.log(Math.round(average(
    SCRIPTS.filter(s => s.living).map(s => s.year)
)));
console.log(Math.round(average(
    SCRIPTS.filter(s => !s.living).map(s => s.year)
)));
