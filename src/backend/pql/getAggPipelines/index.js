const buildAggPipelines = require('./buildAggPipelines')

const parser = require('./parser')

module.exports = pql => {
  const parsedPqlByCollection = parser(pql)

  return buildAggPipelines(parsedPqlByCollection)
}


