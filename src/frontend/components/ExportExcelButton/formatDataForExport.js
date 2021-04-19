import _ from 'lodash'

const formatDataForExport = (
  data = [],
  columns = [],
  isReactTableData = false
) => {
  const dataToFormat = isReactTableData
    ? data.map(({ values }) => values)
    : data

  const formattedData = dataToFormat.map((rowData) =>
    columns.reduce((acc, { Header: key, accessor }) => {
      const value = rowData[accessor]

      acc[key] = value

      return acc
    }, {})
  )

  return formattedData
}

export default formatDataForExport
