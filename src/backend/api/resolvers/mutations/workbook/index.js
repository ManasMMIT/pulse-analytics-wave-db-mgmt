const workbookResolvers = require('./workbook')
const sheetResolvers = require('./sheet')
const fieldResolvers = require('./field')

module.exports = {
  ...workbookResolvers,
  ...sheetResolvers,
  ...fieldResolvers,
}
