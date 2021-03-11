import React from 'react'
import { useQuery } from '@apollo/client'

import { GET_VIEW_LBM_INFLUENCERS } from 'frontend/api/queries'

import PanelHeader from 'frontend/components/Panel/PanelHeader'
import LbmModal from 'frontend/components/BusinessObjectModal/LbmModal'
import PeopleModal from 'frontend/components/BusinessObjectModal/PeopleModal'
import PeopleModalButton from 'frontend/components/BusinessObjectModal/PeopleModal/PeopleModalButton'
import LbmPowerSelect from 'frontend/components/BoPowerSelect/LbmPowerSelect'
import PeoplePowerSelect from 'frontend/components/BoPowerSelect/PeoplePowerSelect'
import Icon from 'frontend/components/Icon'
import Table from 'frontend/components/Table'

import Color from 'frontend/utils/color'

import { CONFIG_TABLE_WIDTH } from 'frontend/components/Table/tableWidths'
import MultiSelectColumnFilter from 'frontend/components/Table/custom-filters/MultiSelect/MultiSelectColumnFilter'
import customMultiSelectFilterFn from 'frontend/components/Table/custom-filters/MultiSelect/customMultiSelectFilterFn'

import createButtonStyle from 'frontend/components/BusinessObjectModal/PeopleModal/createButtonStyle'

const PAGE_TITLE = 'Laboratory Benefit Manager Influencers'

const MODAL_TO_COL_MAP = {
  lbmOrganization: {
    Modal: LbmModal,
    idKey: 'lbmId',
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
    Modal: LbmModal,
    idKey: 'lbmId',
  },
}

const COLUMNS = [
  {
    Header: 'Account',
    accessor: 'lbmOrganization',
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
    Cell: (props: any) => <div style={{ textAlign: 'right' }}>{props.value}</div>,
  },
  {
    Header: 'Position within LBM',
    accessor: 'influencerPosition',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    width: 700,
  },
]

const Influencers = () => {
  const { data, loading } = useQuery<object>(GET_VIEW_LBM_INFLUENCERS)

  let influencerTemplateData: any[] = []
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
          <LbmPowerSelect />
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
        exportProps={{ filename: 'LbmInfluencers', sheetName: 'Influencers' }}
      />
    </div>
  )
}

export default Influencers
