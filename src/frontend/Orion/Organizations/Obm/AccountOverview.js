import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import styled from '@emotion/styled'

import {
  GET_OBM_ORGANIZATIONS,
} from 'frontend/api/queries'

import PanelHeader from '../../../components/Panel/PanelHeader'
import ObmModalButton from '../../../components/BusinessObjectModal/OncologyBenefitManagerModal/OncologyBenefitManagerModalButton'

import {
  useTable,
  useGroupBy,
  useFilters,
  useSortBy,
  useExpanded,
  usePagination,
} from 'react-table'

import Color from './../../../utils/color'

const StyledTd = styled.td({
  padding: 12,
})

const StyledTh = styled.th({
  fontWeight: 700,
  fontSize: 14,
  padding: 12,
})

const createButtonStyle = {
  background: Color.PRIMARY,
  color: Color.WHITE,
  fontWeight: 700,
  margin: 12,
  padding: 12,
  borderRadius: 4,
  cursor: 'pointer',
}

const buttonStyle = {
  cursor: 'pointer',
  fontSize: 12,
}

const tableStyle = {
  margin: '12px 24px',
  width: '100%',
  display: 'block',
  height: 650,
  overflowY: 'scroll',
  borderCollapse: 'collapse',
}

const PAGE_TITLE = 'Oncology Benefit Manager Account Overview'

const MODAL_TO_COL_MAP = {
  'organization': ObmModalButton,
  'start': ObmModalButton,
  'businessModel': ObmModalButton,
}

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  })

  // Render the UI for your table
  return (
    <table style={tableStyle} {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <StyledTh {...column.getHeaderProps()}>{column.render('Header')}</StyledTh>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                const ModalButtonWrapper = MODAL_TO_COL_MAP[cell.column.id]
                const datumId = cell.row.original._id

                return (
                  <StyledTd {...cell.getCellProps()}>
                    <ModalButtonWrapper buttonStyle={buttonStyle} entityId={datumId}>
                      {cell.render('Cell')}
                    </ModalButtonWrapper>
                  </StyledTd>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

const AccountOverview = () => {
  // ? useMemo is from the basic sandbox -- wonder if it's okay to just pull out of render
  const columns = React.useMemo(
    () => [
      {
        Header: 'Account',
        accessor: 'organization',
      },
      {
        Header: 'Start',
        accessor: 'start',
      },
      {
        Header: 'Business Model',
        accessor: 'businessModel',
      },
    ],
    []
  )

  const { data, loading } = useQuery(GET_OBM_ORGANIZATIONS)

  let obms = []
  if (!loading) obms = Object.values(data)[0] || []

  return (
    <div style={{ width: '100%' }}>
      <PanelHeader title={PAGE_TITLE}>
        <ObmModalButton buttonStyle={createButtonStyle}>
          Create OBM
        </ObmModalButton>
      </PanelHeader>
      <Table columns={columns} data={obms} />
    </div>
  )
}

export default AccountOverview
