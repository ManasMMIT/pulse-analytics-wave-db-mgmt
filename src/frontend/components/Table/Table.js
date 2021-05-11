import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
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
import formatDataForExport from '../ExportExcelButton/formatDataForExport'
import { Spacing, Colors } from 'frontend/utils/pulseStyles'

const TemplateWrapper = styled.div(
  {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'scroll',
  },
  ({ width, wrapperStyle }) => ({ width, ...wrapperStyle })
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

const DEFAULT_COLUMN = { Filter: DefaultColumnFilter }
const INITIAL_PAGE_SIZE = 50

const TableHint = () => (
  <span
    style={{
      margin: Spacing.NORMAL,
      fontSize: Spacing.NORMAL,
      color: Colors.MEDIUM_GRAY_2,
      fontStyle: 'italic',
    }}
  >
    Hold shift while clicking column headers for multi-column sort
  </span>
)

const resetTableScroll = () => {
  const tableBodyNode = document.querySelector('.table.sticky')
  tableBodyNode.scrollTo(0, 0)
}

const Table = ({
  columns,
  data,
  modalColMap,
  exportProps,
  exportStyle,
  width,
  wrapperStyle,
  showExportButton,
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
      initialState: { pageSize: INITIAL_PAGE_SIZE, pageIndex: 0 },
    },
    useFilters,
    useSortBy,
    useBlockLayout,
    useSticky,
    usePagination
  )

  // whenever page changes on table, scroll to top
  useEffect(resetTableScroll, [pageIndex])

  let dataFormattedForExport
  if (showExportButton) {
    dataFormattedForExport = formatDataForExport({
      data: sortedRows,
      columns,
      isReactTableData: true,
    })
  }

  return (
    <TemplateWrapper width={width} style={wrapperStyle}>
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
        <TableHint />
        {showExportButton && (
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
        )}
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
  showExportButton: PropTypes.bool,
  wrapperStyle: PropTypes.object,
}

Table.defaultProps = {
  modalColMap: {},
  exportProps: {},
  exportStyle: {},
  width: '100vw',
  showExportButton: true,
  wrapperStyle: {},
}

export default Table
