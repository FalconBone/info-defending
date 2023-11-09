function Lag (l) {
  var values = []
  var n = 0

  function lag (x) {
    if ((l > 0) && (typeof x !== 'undefined')) {
      if (Array.isArray(x)) {
        x.forEach(function (v) {
          lag(v)
        })
      } else {
        n += 1
        if (values.length === 0) {
          values.push(x)
        } else {
          var lim = Math.min(values.length, l - 1)
          for (var i = lim; i > 0; i--) {
            values[i] = values[i - 1]
          }
          values[0] = x
        }
      }
    }
    return values
  }

  lag.fit = function (x) {
    lag(x)
  }

  Object.defineProperty(lag, 'values', {
    get: function () {
      return values
    }
  })

  Object.defineProperty(lag, 'n', {
    get: function () {
      return n
    }
  })

  return lag
}

module.exports = Lag
