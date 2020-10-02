const d3 = require('d3-collection')

const boModalAggPipeline = require('./bo-modal-agg-pipeline')
const widgetAggPipeline = require('./widget-agg-pipeline')

module.exports = async (pulseCoreDb) => {
  const keyLabelBoIdDocsOp = pulseCoreDb
    .collection('businessObjects.modals')
    .aggregate(boModalAggPipeline, { allowDiskUse: true })
    .toArray()

  const widgetLabelDocsOp = pulseCoreDb
    .collection('businessObjects.modals.widgets')
    .aggregate(widgetAggPipeline, { allowDiskUse: true })
    .toArray()

  const [keyLabelBoIdDocs, widgetLabelDocs] = await Promise.all([
    keyLabelBoIdDocsOp,
    widgetLabelDocsOp,
  ])

  const nonRelationalMap = d3
    .nest()
    .key((row) => row.boId)
    .key((row) => row.key)
    .rollup((arr) => arr[0].label)
    .object(keyLabelBoIdDocs)

  const relationalMap = d3
    .nest()
    .key((row) => row.connectedEntities[0])
    .key((row) => row.connectedEntities[1])
    .key((row) => row.key)
    .rollup((arr) => arr[0].label)
    .object(widgetLabelDocs)

  return {
    ...nonRelationalMap,
    ...relationalMap,
  }
}
