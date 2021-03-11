import React from 'react'
import { useQuery } from '@apollo/client'

import { GET_VIEW_OBM_INFLUENCERS } from 'frontend/api/queries'

import PanelHeader from 'frontend/components/Panel/PanelHeader'
import ObmModal from 'frontend/components/BusinessObjectModal/OncologyBenefitManagerModal'
import PeopleModal from 'frontend/components/BusinessObjectModal/PeopleModal'
import PeopleModalButton from 'frontend/components/BusinessObjectModal/PeopleModal/PeopleModalButton'
import ObmPowerSelect from 'frontend/components/BoPowerSelect/ObmPowerSelect'
import PeoplePowerSelect from 'frontend/components/BoPowerSelect/PeoplePowerSelect'
import Icon from 'frontend/components/Icon'
import Table from 'frontend/components/Table'

import Color from 'frontend/utils/color'

import { CONFIG_TABLE_WIDTH } from 'frontend/components/Table/tableWidths'
import MultiSelectColumnFilter from 'frontend/components/Table/custom-filters/MultiSelect/MultiSelectColumnFilter'
import customMultiSelectFilterFn from 'frontend/components/Table/custom-filters/MultiSelect/customMultiSelectFilterFn'

import createButtonStyle from 'frontend/components/BusinessObjectModal/PeopleModal/createButtonStyle'

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
    sticky: 'left',
    width: 200,
  },
  {
    Header: 'First Name',
    accessor: 'influencerFirstName',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    sticky: 'left',
  },
  {
    Header: 'Last Name',
    accessor: 'influencerLastName',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    sticky: 'left',
  },
  {
    Header: 'NPI #',
    accessor: 'influencerNpiNumber',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    Cell: (props) => <div style={{ textAlign: 'right' }}>{props.value}</div>,
  },
  {
    Header: 'Position within OBM',
    accessor: 'influencerPosition',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    width: 700,
  },
]

const Influencers = () => {
  const { data, loading } = useQuery(GET_VIEW_OBM_INFLUENCERS)

  let influencerTemplateData = []
  if (data && !loading) influencerTemplateData = Object.values(data)[0] || []

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <PanelHeader title={PAGE_TITLE}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ObmPowerSelect />
          <PeoplePowerSelect />
          <PeopleModalButton buttonStyle={createButtonStyle}>
            <Icon
              iconName="add"
              color1={Color.WHITE}
              width={16}
              style={{ marginRight: 8 }}
            />
            Create Person
          </PeopleModalButton>
        </div>
      </PanelHeader>
      <Table
        width={CONFIG_TABLE_WIDTH}
        data={influencerTemplateData}
        columns={COLUMNS}
        modalColMap={MODAL_TO_COL_MAP}
        exportProps={{ filename: 'ObmInfluencers', sheetName: 'Influencers' }}
      />
    </div>
  )
}

export default Influencers
