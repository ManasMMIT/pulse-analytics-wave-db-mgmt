import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import { GET_OBM_ORGANIZATIONS } from 'frontend/api/queries'

import PanelHeader from '../../../components/Panel/PanelHeader'
import ObmModalButton from '../../../components/BusinessObjectModal/OncologyBenefitManagerModal/OncologyBenefitManagerModalButton'
import TemplateTable from './TemplateTable'
import NumberRangeColumnFilter from './TemplateTable/NumberRangeColumnFilter'
import MultiSelectColumnFilter from './TemplateTable/MultiSelectColumnFilter'

import customMultiSelectFilterFn from './TemplateTable/custom-filters/customMultiSelectFilterFn'

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

const MODAL_TO_COL_MAP = {
  organization: { Modal: ObmModalButton, idKey: '_id' },
  start: { Modal: ObmModalButton, idKey: '_id' },
  businessModel: { Modal: ObmModalButton, idKey: '_id' },
}

const COLUMNS = [
  {
    Header: 'Account',
    accessor: 'organization',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Start',
    accessor: 'start',
    Filter: NumberRangeColumnFilter,
    filter: 'between',
  },
  {
    Header: 'Business Model',
    accessor: 'businessModel',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
]

const AccountOverview = () => {
  const { data, loading } = useQuery(GET_OBM_ORGANIZATIONS)

  let obms = []
  if (!loading) obms = Object.values(data)[0] || []

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <PanelHeader title={PAGE_TITLE}>
        <ObmModalButton buttonStyle={createButtonStyle}>
          Create OBM
        </ObmModalButton>
      </PanelHeader>
      <TemplateTable
        data={obms}
        columns={COLUMNS}
        modalColMap={MODAL_TO_COL_MAP}
      />
    </div>
  )
}

export default AccountOverview
