import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import { GET_OBM_ORGANIZATIONS } from 'frontend/api/queries'

import PanelHeader from '../../../components/Panel/PanelHeader'
import ObmModalButton from '../../../components/BusinessObjectModal/OncologyBenefitManagerModal/OncologyBenefitManagerModalButton'
import TemplateTable from './TemplateTable'
import SelectColumnFilter from './TemplateTable/SelectColumnFilter'
import MultiSelectColumnFilter from './TemplateTable/MultiSelectColumnFilter'

import customSelectFilterFn from './TemplateTable/custom-filters/customSelectFilterFn'
import customMultiSelectFilterFn from './TemplateTable/custom-filters/customMultiSelectFilterFn'
import customSelectNumberFilterFn from './TemplateTable/custom-filters/customSelectNumberFilterFn'

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

const AccountOverview = () => {
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
      <TemplateTable
        columns={columns}
        data={obms}
        modalColMap={MODAL_TO_COL_MAP}
      />
    </div>
  )
}

export default AccountOverview
