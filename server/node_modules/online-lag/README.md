# online-lag
Stores last X values of a data stream

## Usage
```javascript
const Lag = require('online-lag')
const lag = Lag(4)

;[1, 2, 3, [4, 5], 6, 7].forEach(v => {
  lag(v) // accepts arrays too
})

console.log('Values; total number of observations: ', l.values, l.n) // [7,6,5,4] 7
```
