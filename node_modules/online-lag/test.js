var test = require('tape')
var Lag = require('.')

test('Lag(N<1) or Lag(not number) always give empty array', _ => {
  var l1 = Lag(0)
  var l2 = Lag('asd')
  ;[1, 2, 3, 4].forEach(v => {
    l1(v)
    l2(v)
  })
  _.equal(l1.values.length, 0)
  _.equal(l1.n, 0)
  _.equal(l2.values.length, 0)
  _.equal(l2.n, 0)
  _.end()
})

test('Lag(N=5)', _ => {
  var l1 = Lag(5)
  ;[1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(v => {
    l1.fit(v)
  })
  _.deepEqual(l1.values, [9, 8, 7, 6, 5])
  _.equal(l1.n, 9)
  _.end()
})

test('Lag(N=5), array input', _ => {
  var l1 = Lag(5)
  l1(0)
  l1([1, 2, 3, 4, 5, 6, 7, 8, 9])
  l1(10)
  _.deepEqual(l1(), [10, 9, 8, 7, 6])
  _.equal(l1.n, 11)
  _.end()
})
