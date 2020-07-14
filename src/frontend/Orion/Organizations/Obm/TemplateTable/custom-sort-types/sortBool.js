export default (rowA, rowB, columnId, desc) => {
  let valueA = rowA.values[columnId]
  let valueB = rowB.values[columnId]

  valueA = Boolean(valueA) ? 1 : 0
  valueB = Boolean(valueB) ? 1 : 0

  return valueB - valueA
}
