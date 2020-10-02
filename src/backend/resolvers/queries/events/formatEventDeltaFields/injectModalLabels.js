module.exports = ({ deltas, fieldLabelMap, boId, connectedEntities }) => {
  if (!fieldLabelMap) return deltas

  return deltas.map((delta) => {
    let field = delta.field

    if (boId && fieldLabelMap[boId.toString()]) {
      const modalLabel = fieldLabelMap[boId.toString()][field]
      if (modalLabel) field = modalLabel
    } else if (connectedEntities) {
      field = getWidgetFieldLabel(connectedEntities, fieldLabelMap, field)
    }

    field = field.replace(/Ids?$/, '')

    return {
      ...delta,
      field,
    }
  })
}

const getWidgetFieldLabel = (connectedEntities, fieldLabelMap, field) => {
  const [first, second] = connectedEntities.map(({ boId }) => boId.toString())

  let modalLabel
  if (fieldLabelMap[first] && fieldLabelMap[first][second]) {
    modalLabel = fieldLabelMap[first][second][field]
  }
  if (fieldLabelMap[second] && fieldLabelMap[second][first]) {
    modalLabel = fieldLabelMap[second][first][field]
  }

  return modalLabel ? modalLabel : field
}
