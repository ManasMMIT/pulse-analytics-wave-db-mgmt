import _ from 'lodash'

export default (rowA, rowB, columnId, desc) => {
  let valueA = rowA.values[columnId]
  let valueB = rowB.values[columnId]

  if (_.isNull(valueA)) return -1
  if (_.isNull(valueB)) return 1

  if (valueA === valueB) return 0

  return Number(valueB) > Number(valueA) ? -1 : 1
}
