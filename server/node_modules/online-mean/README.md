# online-mean
Online mean calculation (piece-by-piece)

## Usage
```javascript
const Mean = require('online-mean')

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
```

## How it works
A classical formula of a sample mean is defined as follows:

> ā<sub>n</sub> = (<strong>Σ</strong><sub>i=1..n </sub>x<sub>i</sub>) / n

It basically iterates over all values of <code><b>x</b></code>, sums them and divides on total number of samples. That works when the length of <code><b>x</b></code> is small and you don't need to update the mean when new values added. To calculate mean <code>ā</code> in on-line fashion we will use a recursive formula:

> ā<sub>n</sub> = ā<sub>n-1</sub> + (x<sub>n</sub> - ā<sub>n-1</sub>) / n

It's still based on the classical formula, however instead of summing all values we calculate <code>ā</code> recursively. Derivation:

> ā<sub>n</sub> = (<strong>Σ</strong><sub>i=1..n </sub>x<sub>i</sub>) / n <br>
> ā<sub>n</sub> = (<strong>Σ</strong><sub>i=1..n-1 </sub>x<sub>i</sub> + x<sub>n</sub>) / n <br>
> ā<sub>n</sub> = ((n-1) × ā<sub>n-1</sub> + x<sub>n</sub>) / n <br>
> ā<sub>n</sub> = ā<sub>n-1</sub> + (-ā<sub>n-1</sub> + x<sub>n</sub>) / n <br>
> ā<sub>n</sub> = ā<sub>n-1</sub> + (x<sub>n</sub> - ā<sub>n-1</sub>) / n <br>

To merge multiple means without iterating over all values of x, we will expand the formula a little:

> ā<sub>nm</sub> = (<strong>Σ</strong><sub>i=1..n </sub>x<sub>i</sub> + <strong>Σ</strong><sub>j=1..m </sub>x<sub>j</sub>) / (n + m) <br>
> ā<sub>nm</sub> = (n * ā<sub>n</sub> + m * ā<sub>m</sub>) / (n + m) <br>

Such multiplications in the numerator could produce quite big numbers, so it's better to change the expression:
> ā<sub>nm</sub> = (n * ā<sub>n</sub> + m * ā<sub>n</sub> - m * ā<sub>n</sub> + m * ā<sub>m</sub>) / (n + m) <br>
> ā<sub>nm</sub> = ā<sub>n</sub> + (- m * ā<sub>n</sub> + m * ā<sub>m</sub>) / (n + m) <br>
> ā<sub>nm</sub> = ā<sub>n</sub> + (ā<sub>m</sub> - ā<sub>n</sub>) * m / (n + m) <br>

Much better! :)


