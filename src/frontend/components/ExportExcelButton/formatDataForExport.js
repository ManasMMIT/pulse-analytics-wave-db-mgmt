import _ from 'lodash'

/*
  This util function accepts data coming both from the Table component (through react-table) and
  also data that that has not been formatted through react-table. This is so that exports from
  the export button that's built into the Table component retain the table's sorting order.

  Exports from a detached export button will not retain the table's sorting order.

  The cellsToFormat prop is needed so that Cell formatters that are meant to return JSX are
  not applied.
*/

const formatDataForExport = ({
  data = [],
  columns = [],
  isReactTableData = false,
  cellsToFormat = [],
}) => {
  const dataToFormat = isReactTableData
    ? data.map(({ values }) => values)
    : data

  const formattedData = dataToFormat.map((rowData) =>
    columns.reduce((acc, { Header, accessor, Cell: cellFormatter }) => {
      let value = rowData[accessor]

      // Data coming from react-table already has already been formatted through accessor functions
      if (!isReactTableData && _.isFunction(accessor)) {
        value = accessor(rowData)
      }

      if (cellsToFormat.includes(accessor) && _.isFunction(cellFormatter)) {
        value = cellFormatter({ value })
      }

      // Use the Header value for proper casing on the exported column header
      acc[Header] = value

      return acc
    }, {})
  )

  return formattedData
}

export default formatDataForExport
