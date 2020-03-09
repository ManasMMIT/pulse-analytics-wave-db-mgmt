const workbookTypeDefs = require('./workbook')
const sheetTypeDefs = require('./sheet')
const fieldTypeDefs = require('./field')

module.exports = [
  ...workbookTypeDefs,
  ...sheetTypeDefs,
  ...fieldTypeDefs,
]
