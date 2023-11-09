const Mean = require('./')

// Create a new mean object calling Mean() or new Mean()
// Each of these object stores inner variables
// So we need this extra step to be able to calculate means of multiple data flows
const m1 = Mean()
const m2 = new Mean() // same as const m2 = Mean()

// Update calling mean objects directly, as a function:
;[1, 2, 3, 4, 5].forEach(v => { m1(v) })

// Or via .fit() method. These two ways are identical!
;[4, 5, 6, 7, 8].forEach(v => { m2.fit(v) })

// Using  with arrays:
m1([9, 10, 11]) // Keep in mind - this line updates m1 with 3 new data values, not just averages the array

// Get mean value calling mean object with no arguments:
console.log('m1:', m1()) // -> 5.625

// Or via .value getter
console.log('m2:', m2.value) // -> 6

// Total number of observations:
console.log('m2 n:', m2.n) // -> 5

// Merge multiple mean objects:
const m3 = Mean.merge(m1, m2)
console.log('m3:', m3.value) // -> ~5.769

// 'n' and 'value' are not just object keys, but object getters.
// If you really need to change their values use .setN() and .setValue() methods:
m2.setValue(0)
m2.setN(0)
console.log(m2.value, m2.n) // -> 0 0
