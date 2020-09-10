import PropTypes from 'prop-types'
import React, { useState } from 'react'
import styled from '@emotion/styled'

import {
  useTable,
  useBlockLayout,
  useFilters,
  useSortBy,
  usePagination,
} from 'react-table'
import { useSticky } from 'react-table-sticky'

import ExportExcelButton from 'frontend/components/ExportExcelButton'
import Icon from 'frontend/components/Icon'
import Color from 'frontend/utils/color'

import TableWrapper from './TableWrapper'
import Headers from './Headers'
import Rows from './Rows'
import Pagination from './Pagination'
import ModalManager from './ModalManager'
import sortTypes from './custom-sort-types'
import formatDataForExport from './formatDataForExport'

const TemplateWrapper = styled.div(
  {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'scroll',
  },
  ({ width }) => ({ width })
)

const DefaultColumnFilter = ({
  column: { filterValue, preFilteredRows, setFilter },
}) => {
  const count = preFilteredRows.length

  return (
    <input
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  )
}

const DEFAULT_COLUMN = {
  Filter: DefaultColumnFilter,
}

const Table = ({
  columns,
  data,
  modalColMap,
  exportProps,
  exportStyle,
  width,
}) => {
  const [modalCell, setModalCell] = useState(null)

  const {
    state: { pageIndex, pageSize },
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    page,
    prepareRow,
    sortedRows,
    ...tablePropOverflow
  } = useTable(
    {
      columns,
      data,
      defaultColumn: DEFAULT_COLUMN,
      maxMultiSortColCount: 5,
      disableMultiRemove: true,
      sortTypes,
      initialState: { pageSize: 50, pageIndex: 0 },
    },
    useFilters,
    useSortBy,
    useBlockLayout,
    useSticky,
    usePagination
  )

  const dataFormattedForExport = formatDataForExport(sortedRows, columns)

  return (
    <TemplateWrapper width={width}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          alignItems: 'center',
        }}
      >
        {data.length ? (
          <Pagination {...{ pageIndex, pageSize, ...tablePropOverflow }} />
        ) : null}
        <div style={{ margin: '0 24px 0 auto', ...exportStyle }}>
          <ExportExcelButton
            data={dataFormattedForExport}
            buttonStyle={{
              margin: '0 0 12px',
              display: 'flex',
              alignItems: 'center',
            }}
            {...exportProps}
          >
            <Icon
              iconName="export"
              color1={Color.PRIMARY}
              width={16}
              height={16}
              style={{ marginRight: 8 }}
            />
            Export to Excel
          </ExportExcelButton>
        </div>
      </div>
      <TableWrapper>
        <div
          className="table sticky"
          style={{ height: '100%' }}
          {...getTableProps()}
        >
          <Headers headerGroups={headerGroups} />

          <div {...getTableBodyProps()} className="body">
            <Rows
              rows={page}
              prepareRow={prepareRow}
              setModalCell={setModalCell}
              modalColMap={modalColMap}
            />
          </div>
        </div>
      </TableWrapper>

      {/* TODO: Decouple Modal Manager from Template Table */}
      <ModalManager modalColMap={modalColMap} modalCell={modalCell} />
    </TemplateWrapper>
  )
}

Table.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  exportProps: PropTypes.object,
  exportStyle: PropTypes.object,
  modalColMap: PropTypes.object,
  width: PropTypes.string, // Dynamic width constants can be found in tableWidths.js
}

Table.defaultProps = {
  modalColMap: {},
  exportProps: {},
  exportStyle: {},
  width: '100vw',
}

export default Table
