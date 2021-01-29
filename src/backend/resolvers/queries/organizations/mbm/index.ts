import lbmResolvers from './lbm'
const obmResolvers = require('./obm')

module.exports = {
  ...obmResolvers,
  ...lbmResolvers,
}
