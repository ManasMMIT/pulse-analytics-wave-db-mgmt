import _ from 'lodash'

const sortTextArray = (rowA, rowB, columnId) => {
  const valueA = rowA.values[columnId].join()
  const valueB = rowB.values[columnId].join()

  if (_.isEmpty(valueA) && _.isEmpty(valueB)) return 0
  if (_.isEmpty(valueB)) return -1
  if (_.isEmpty(valueA)) return 1

  return valueA.toLowerCase().localeCompare(valueB.toLowerCase())
}

export default sortTextArray
