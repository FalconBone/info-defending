const Lag = require('.')

const l = Lag(4)

;[1, 2, 3, [4, 5], 6, 7].forEach(v => {
  console.log(l(v))
})

console.log('Values, n: ', l.values, l.n)
