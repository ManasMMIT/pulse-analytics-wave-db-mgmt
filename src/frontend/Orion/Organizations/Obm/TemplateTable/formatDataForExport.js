import _ from 'lodash'

const formatDataForExport = (data, columns) => {
  const keyToLabelMap = columns.reduce((acc, { Header, accessor }) => {
    acc[accessor] = Header
    return acc
  }, {})

  const formattedData = data.map(({ values }) => {
    return _.mapKeys(values, (v, k) => keyToLabelMap[k])
  })

  return formattedData
}

export default formatDataForExport
