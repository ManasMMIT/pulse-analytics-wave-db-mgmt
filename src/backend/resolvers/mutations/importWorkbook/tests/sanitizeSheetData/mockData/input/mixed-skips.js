const dataWithOnlySkips = require('./only-skips')
const dataWithFalseySkips = require('./falsey-skips')

module.exports = [
  ...dataWithOnlySkips,
  ...dataWithFalseySkips,
]
