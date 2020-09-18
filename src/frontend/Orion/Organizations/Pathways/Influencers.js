import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import { GET_VIEW_PATHWAYS_INFLUENCERS } from 'frontend/api/queries'

import PanelHeader from 'frontend/components/Panel/PanelHeader'
import Table from 'frontend/components/Table'
import PeoplePowerSelect from 'frontend/components/BoPowerSelect/PeoplePowerSelect'
import PeopleModalButton from 'frontend/components/BusinessObjectModal/PeopleModal/PeopleModalButton'
import PeopleModal from 'frontend/components/BusinessObjectModal/PeopleModal'
import PathwaysModal from 'frontend/components/BusinessObjectModal/PathwaysModal'
import createButtonStyle from 'frontend/components/BusinessObjectModal/PeopleModal/createButtonStyle'
import Icon from 'frontend/components/Icon'
import Color from 'frontend/utils/color'

import { CONFIG_TABLE_WIDTH } from 'frontend/components/Table/tableWidths'
import MultiSelectColumnFilter from 'frontend/components/Table/custom-filters/MultiSelect/MultiSelectColumnFilter'
import customMultiSelectFilterFn from 'frontend/components/Table/custom-filters/MultiSelect/customMultiSelectFilterFn'

const PAGE_TITLE = 'Pathways Influencers'

const MODAL_TO_COL_MAP = {
  pathwaysOrganization: {
    Modal: PathwaysModal,
    idKey: 'pathwaysId',
  },
  influencerFirstName: {
    Modal: PeopleModal,
    idKey: 'influencerId',
  },
  influencerMiddleName: {
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
    Modal: PathwaysModal,
    idKey: 'pathwaysId',
  },
}

const COLUMNS = [
  {
    Header: 'Date Updated',
    accessor: 'updatedOn',
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
    width: 100,
  },
  {
    Header: 'Middle Name',
    accessor: 'influencerMiddleName',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    sticky: 'left',
    width: 100,
  },
  {
    Header: 'Last Name',
    accessor: 'influencerLastName',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    sticky: 'left',
    width: 100,
  },
  {
    Header: 'Status',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    sticky: 'left',
    width: 100,
  },
  {
    Header: 'Pathways Organization',
    accessor: 'pathwaysOrganization',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    width: 200,
  },
  {
    Header: 'NPI #',
    accessor: 'influencerNpiNumber',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    width: 200,
  },
  {
    Header: 'Management Type',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    width: 200,
  },
  {
    Header: 'Influencer Type',
    accessor: 'influencerType',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    width: 200,
  },
  {
    Header: 'Pathways Position',
    accessor: 'influencerPosition',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    width: 200,
  },
]

const PathwaysInfluencers = () => {
  const { data, loading } = useQuery(GET_VIEW_PATHWAYS_INFLUENCERS)

  let pathwaysInfluencerData = []
  if (data && !loading) pathwaysInfluencerData = Object.values(data)[0] || []

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <PanelHeader title={PAGE_TITLE}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
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
        data={pathwaysInfluencerData}
        columns={COLUMNS}
        modalColMap={MODAL_TO_COL_MAP}
        exportProps={{
          filename: 'PathwaysInfluencers',
          sheetName: 'Pathways Influencers',
        }}
      />
    </div>
  )
}

export default PathwaysInfluencers
