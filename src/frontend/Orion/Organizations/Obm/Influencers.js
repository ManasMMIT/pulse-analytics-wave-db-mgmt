import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import { GET_INFLUENCER_TEMPLATE_OBMS } from 'frontend/api/queries'

import PanelHeader from '../../../components/Panel/PanelHeader'
import ObmModalButton from '../../../components/BusinessObjectModal/OncologyBenefitManagerModal/OncologyBenefitManagerModalButton'
import PeopleModalButton from '../../../components/BusinessObjectModal/PeopleModal/PeopleModalButton'

import TemplateTable from './TemplateTable'
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

const PAGE_TITLE = 'Oncology Benefit Manager Influencers'

const MODAL_TO_COL_MAP = {
  obmOrganization: {
    Modal: ObmModalButton,
    idKey: 'obmId',
  },
  influencerName: {
    Modal: PeopleModalButton,
    idKey: 'influencerId',
  },
  influencerNpiNumber: {
    Modal: PeopleModalButton,
    idKey: 'influencerId',
  },
  influencerPosition: {
    Modal: ObmModalButton,
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
    Header: 'Influencer Name',
    accessor: 'influencerName',
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
        flex: 1,
      }}
    >
      <PanelHeader title={PAGE_TITLE}>
        <PeopleModalButton buttonStyle={createButtonStyle}>
          Create Influencer
        </PeopleModalButton>
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
