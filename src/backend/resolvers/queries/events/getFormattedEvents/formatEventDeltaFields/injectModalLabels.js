module.exports = ({ deltas, fieldLabelMaps, boId, connectedEntities }) => {
  if (!fieldLabelMaps) return deltas

  const { basicModalMap, widgetModalMap } = fieldLabelMaps

  return deltas.map((delta) => {
    let field = delta.field

    if (boId && basicModalMap[boId]) {
      const modalLabel = basicModalMap[boId][field]
      if (modalLabel) field = modalLabel
    } else if (connectedEntities) {
      field = getWidgetFieldLabel(connectedEntities, widgetModalMap, field)
    }

    field = field.replace(/Ids?$/, '')

    return {
      ...delta,
      field,
    }
  })
}

const getWidgetFieldLabel = (connectedEntities, widgetModalMap, field) => {
  const [first, second] = connectedEntities.map(({ boId }) => boId)

  let modalLabel
  if (widgetModalMap[first] && widgetModalMap[first][second]) {
    modalLabel = widgetModalMap[first][second][field]
  }
  if (widgetModalMap[second] && widgetModalMap[second][first]) {
    modalLabel = widgetModalMap[second][first][field]
  }

  return modalLabel ? modalLabel : field
}
