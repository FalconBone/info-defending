function smooth (x1, x2, e) {
  return x1 + e * (x2 - x1)
}

function Mean () {
  var value = 0
  var n = 0

  var mean = function mean (x) {
    if (!isNaN(x)) {
      if (typeof x !== 'number') {
        x = parseFloat(x)
      }
      n += 1
      value = smooth(value, x, 1 / n)
    } else if (Array.isArray(x)) {
      x.forEach(el => mean(el))
    }
    return value
  }

  mean.fit = function (x) {
    mean(x)
  }

  mean.setValue = function (newValue) {
    value = newValue
  }

  mean.setN = function (newN) {
    n = newN
  }

  Object.defineProperty(mean, 'value', {
    get: function () {
      return value
    }
  })

  Object.defineProperty(mean, 'n', {
    get: function () {
      return n
    }
  })

  return mean
}

Mean.merge = function merge () {
  if (arguments.length) {
    var mean = new Mean()
    mean.setValue(arguments[0].value)
    mean.setN(arguments[0].n)
    for (var i = 1; i < arguments.length; i++) {
      mean.setN(mean.n + arguments[i].n)
      mean.setValue(smooth(
        mean.value,
        arguments[i].value,
        arguments[i].n / mean.n
      ))
    }
    return mean
  } else {
    throw new Error('Provide arguments: Mean() objects')
  }
}

module.exports = Mean
