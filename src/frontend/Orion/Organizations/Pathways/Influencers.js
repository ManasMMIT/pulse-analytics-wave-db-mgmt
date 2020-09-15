import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import PanelHeader from 'frontend/components/Panel/PanelHeader'
import Table from 'frontend/components/Table'
import PeoplePowerSelect from 'frontend/components/BoPowerSelect/PeoplePowerSelect'
import PeopleModalButton from 'frontend/components/BusinessObjectModal/PeopleModal/PeopleModalButton'
import createButtonStyle from 'frontend/components/BusinessObjectModal/PeopleModal/createButtonStyle'
import Icon from 'frontend/components/Icon'
import Color from 'frontend/utils/color'

import { CONFIG_TABLE_WIDTH } from 'frontend/components/Table/tableWidths'
import MultiSelectColumnFilter from 'frontend/components/Table/custom-filters/MultiSelect/MultiSelectColumnFilter'
import customMultiSelectFilterFn from 'frontend/components/Table/custom-filters/MultiSelect/customMultiSelectFilterFn'

const PAGE_TITLE = 'Pathways Influencers'

const COLUMNS = [
  {
    Header: 'Date Updated',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    sticky: 'left',
    width: 200,
  },
  {
    Header: 'Name',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    sticky: 'left',
    width: 300,
  },
  {
    Header: 'Status',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    sticky: 'left',
    width: 300,
  },
  {
    Header: 'Pathways Organization',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    Cell: (props) => <div style={{ textAlign: 'right' }}>{props.value}</div>,
    width: 300,
  },
  {
    Header: 'NPI #',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    width: 400,
  },
  {
    Header: 'Management Type',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    width: 400,
  },
  {
    Header: 'Influencer Type',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    width: 400,
  },
  {
    Header: 'Pathways Position',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    width: 400,
  },
]

const PathwaysInfluencers = () => {
  // const { data, loading } = useQuery(GET_VIEW_PATHWAY_INFLUENCERS)

  // let pathwayInfluencerData = []
  // if (data && !loading) pathwayInfluencerData = Object.values(data)[0] || []

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
        data={[]}
        columns={COLUMNS}
        exportProps={{
          filename: 'PathwaysInfluencers',
          sheetName: 'Pathways Influencers',
        }}
      />
    </div>
  )
}

export default PathwaysInfluencers
