import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import { GET_INFLUENCER_TEMPLATE_OBMS } from 'frontend/api/queries'

import PanelHeader from '../../../components/Panel/PanelHeader'
import ObmModal from '../../../components/BusinessObjectModal/OncologyBenefitManagerModal'
import PeopleModal from '../../../components/BusinessObjectModal/PeopleModal'
import PeopleModalButton from '../../../components/BusinessObjectModal/PeopleModal/PeopleModalButton'

import TemplateTable from './TemplateTable'
import MultiSelectColumnFilter from './TemplateTable/custom-filters/MultiSelect/MultiSelectColumnFilter'
import customMultiSelectFilterFn from './TemplateTable/custom-filters/MultiSelect/customMultiSelectFilterFn'

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

const PAGE_TITLE = 'Oncology Benefit Manager Influencers'

const MODAL_TO_COL_MAP = {
  obmOrganization: {
    Modal: ObmModal,
    idKey: 'obmId',
  },
  influencerFirstName: {
    Modal: PeopleModal,
    idKey: 'influencerId',
  },
  influencerLastName: {
    Modal: PeopleModal,
    idKey: 'influencerId',
  },
  influencerNpiNumber: {
    Modal: PeopleModal,
    idKey: 'influencerId',
  },
  influencerPosition: {
    Modal: ObmModal,
    idKey: 'obmId',
  },
}

const COLUMNS = [
  {
    Header: 'Account',
    accessor: 'obmOrganization',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Influencer First Name',
    accessor: 'influencerFirstName',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Influencer Last Name',
    accessor: 'influencerLastName',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'NPI #',
    accessor: 'influencerNpiNumber',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Positioning within OBM',
    accessor: 'influencerPosition',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
]

const Influencers = () => {
  const { data, loading } = useQuery(GET_INFLUENCER_TEMPLATE_OBMS)

  let influencerTemplateData = []
  if (data && !loading) influencerTemplateData = Object.values(data)[0] || []

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 'calc(100vw - 318px)',
      }}
    >
      <PanelHeader title={PAGE_TITLE}>
        <PeopleModalButton buttonStyle={createButtonStyle}>Create Influencer</PeopleModalButton>
      </PanelHeader>
      <TemplateTable
        data={influencerTemplateData}
        columns={COLUMNS}
        modalColMap={MODAL_TO_COL_MAP}
      />
    </div>
  )
}

export default Influencers
