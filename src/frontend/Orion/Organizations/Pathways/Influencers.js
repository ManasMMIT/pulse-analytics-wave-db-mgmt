import React from 'react'

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

import usePathwaysPersonConnections from 'frontend/hooks/usePathwaysPersonConnections'

const PAGE_TITLE = 'Pathways Influencers'

const MODAL_TO_COL_MAP = {
  organization: {
    Modal: PathwaysModal,
    idKey: 'pathwaysId',
  },
  firstName: {
    Modal: PeopleModal,
    idKey: 'personId',
  },
  middleName: {
    Modal: PeopleModal,
    idKey: 'personId',
  },
  lastName: {
    Modal: PeopleModal,
    idKey: 'personId',
  },
  nationalProviderIdentifier: {
    Modal: PeopleModal,
    idKey: 'personId',
  },
  position: {
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
    accessor: 'firstName',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    sticky: 'left',
    width: 100,
  },
  {
    Header: 'Middle Name',
    accessor: 'middleName',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    sticky: 'left',
    width: 100,
  },
  {
    Header: 'Last Name',
    accessor: 'lastName',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    sticky: 'left',
    width: 100,
  },
  {
    Header: 'Status',
    accessor: 'status',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    sticky: 'left',
    width: 100,
  },
  {
    Header: 'Pathways Organization',
    accessor: 'organization',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    width: 200,
  },
  {
    Header: 'NPI #',
    accessor: 'nationalProviderIdentifier',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    width: 200,
  },
  {
    Header: 'Management Type',
    accessor: 'internalFields.pathwaysManagementTypes',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    width: 200,
    Cell: ({ value }) => (value ? value.join(', ') : []),
  },
  {
    Header: 'Influencer Type',
    accessor: 'pathwaysInfluencerTypes',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    width: 200,
    Cell: ({ value }) => (value ? value.join(', ') : []),
  },
  {
    Header: 'Pathways Position',
    accessor: 'position',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    width: 200,
  },
]

const PathwaysInfluencers = () => {
  const { data: pathwaysInfluencerData } = usePathwaysPersonConnections()

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
