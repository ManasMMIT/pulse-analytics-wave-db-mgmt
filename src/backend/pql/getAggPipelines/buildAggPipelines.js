const { ObjectId } = require('mongodb')

const {
  fieldMatchMaker,
  conjunctionMatchMaker,
  verbMatchMaker,
} = require('./match-makers')

const buildStage = (subject, verb, values) => { // the inner ops before bundling by logical and/or
  const field = fieldMatchMaker(subject)
  const op = verbMatchMaker(verb)

  let formattedValues = values
  if (field === '_id') {
    formattedValues = values.map(_id => ObjectId(_id))
  }

  return {
    [field]: {
      [op]: formattedValues
    }
  }
}

const wrapStagesInLogic = (aggStages, conjunction) => {
  const logicOp = conjunctionMatchMaker(conjunction)
  
  return {
    [logicOp]: aggStages
  }
}

const buildAggPipeline = zippedAggPipelineData => {
  const [subjects, verbs, values, conjunctions] = zippedAggPipelineData

  const flatAggStages = []
  while (subjects.length) {
    const subject = subjects.shift()
    const verb = verbs.shift()
    const value = values.shift()

    const stage = buildStage(subject, verb, value)

    flatAggStages.push(stage)
  }

  const logicWrappedStages = []
  while (flatAggStages.length) {
    const stages = flatAggStages.splice(0, 2)

    if (stages.length < 2) {
      logicWrappedStages.push({ $match: stages[0] })
    } else {
      const conjunction = conjunctions.shift()

      const wrappedStages = wrapStagesInLogic(stages, conjunction)

      logicWrappedStages.push({ $match: wrappedStages })
    }
  }

  return logicWrappedStages
}

module.exports = parsedPqlByCollection => {
  const aggPipelinesByCollections = Object.keys(parsedPqlByCollection).reduce((acc, collection) => {
    const zippedPipelineData = parsedPqlByCollection[collection]

    acc[collection] = buildAggPipeline(zippedPipelineData)

    return acc
  }, {})

  return aggPipelinesByCollections
}
