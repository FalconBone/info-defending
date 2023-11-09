var test = require('tape')
var Mean = require('./index')

var values = [1, 3, 5, NaN, 'Bob', '6', 8]

test('Simple test with NaN and Strings', (_) => {
  var mean = Mean()
  values.forEach(v => { mean(v) })
  console.log(mean())
  _.equal(mean(), 4.6)
  _.end()
})

test('1 million numbers (0,1000000), int: 1', (_) => {
  var mean = Mean()
  for (var i = 0; i <= 1000000; i++) {
    mean(i)
  }
  console.log(mean())
  _.equal(mean(), 500000)
  _.end()
})

test('1 million numbers (0,100000), int: 0.1, err < 0.1', (_) => {
  var mean = Mean()
  for (var i = 0; i <= 100000; i += 0.1) {
    mean(i)
  }
  console.log(mean())
  _.true(mean() - 50000 < 0.1, 'Floating point cumulative error is quite high when N is big')
  _.end()
})

test('1 million numbers (100000, 0), int: 0.1, err < 0.1', (_) => {
  var mean = Mean()
  for (var i = 100000; i >= 0; i -= 0.1) {
    mean(i)
  }
  console.log(mean())
  _.true(mean() - 50000 < 0.1, 'Floating point cumulative error is quite high when N is big')
  _.end()
})

test('Merging means', (_) => {
  var m1 = Mean()
  var m2 = Mean()
  ;[4, 5, 6].forEach(v => m1(v))
  ;[7, 8, 9].forEach(v => m2(v))
  var m3 = Mean.merge(m1, m2)
  _.true(m3.value - 6.5 < 0.001)
  _.end()
})

test('Mean of array', (_) => {
  var mean = Mean()
  mean([1, 2, 3, 4, 5])
  mean([6, 7])
  _.true(mean.value - 4 < 0.001)
  _.end()
})

test('Immutable mean.value and mean.n', (_) => {
  var mean = Mean()
  mean([1, 2, 3, 4, 5])
  mean.value = 0
  mean.n = 1
  _.true(mean.value - 3 < 0.001)
  _.equal(mean.n, 5)
  mean.setValue(0)
  mean.setN(0)
  _.equal(mean.value, 0)
  _.equal(mean.n, 0)
  _.end()
})

test('Check mean.fit()', (_) => {
  var mean = Mean()
  ;[1, 2, 3, 4, 5].forEach(v => mean.fit(v))
  _.true(mean.value - 3 < 0.001)
  _.end()
})
