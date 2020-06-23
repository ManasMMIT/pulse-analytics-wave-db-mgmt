import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import {
  GET_OBM_ORGANIZATIONS,
} from 'frontend/api/queries'

import PanelHeader from '../../../components/Panel/PanelHeader'
import ObmModalButton from '../../../components/BusinessObjectModal/OncologyBenefitManagerModal/OncologyBenefitManagerModalButton'
import TemplateTable from './TemplateTable'
import SelectColumnFilter from './TemplateTable/SelectColumnFilter'
import MultiSelectColumnFilter from './TemplateTable/MultiSelectColumnFilter'

import Color from './../../../utils/color'

const createButtonStyle = {
  background: Color.PRIMARY,
  color: Color.WHITE,
  fontWeight: 700,
  margin: 12,
  padding: 12,
  borderRadius: 4,
  cursor: 'pointer',
}

const PAGE_TITLE = 'Oncology Benefit Manager Account Overview'

const customMultiSelectFilterFn = (filter, row, filterValue) => {
  if (!filterValue) return filter

  const colKey = row[0]

  const filterValueArray = filterValue.split(', ')

  return filter.filter(rowDatum => {
    return rowDatum.values[colKey] === filterValue ||
      filterValueArray.includes(rowDatum.values[colKey])
  })
}

const customSelectFilterFn = (filter, row, filterValue) => {
  const [colKey] = row
  if (filterValue === 'All') return filter
  return filter.filter(datum => datum.values[colKey] === filterValue)
}

const customSelectNumberFilterFn = (filter, row, filterValue) => {
  const [colKey] = row
  if (filterValue === 'All') return filter
  filterValue = Number(filterValue)

  return filter.filter(datum => datum.values[colKey] === filterValue)
}

const AccountOverview = () => {
  // ? useMemo is from the basic sandbox -- wonder if it's okay to just pull out of render
  const columns = React.useMemo(
    () => [
      {
        Header: 'Account',
        accessor: 'organization',
        Filter: MultiSelectColumnFilter,
        sortType: 'basic',
        filter: customMultiSelectFilterFn,
      },
      {
        Header: 'Start',
        accessor: 'start',
        Filter: SelectColumnFilter,
        filter: customSelectNumberFilterFn,
        sortType: 'basic',
      },
      {
        Header: 'Business Model',
        accessor: 'businessModel',
        Filter: SelectColumnFilter,
        filter: customSelectFilterFn,
        sortType: 'basic',
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
      <TemplateTable columns={columns} data={obms} />
    </div>
  )
}

export default AccountOverview
