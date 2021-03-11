import React from 'react'
import { useQuery } from '@apollo/client'

import { GET_PATHWAYS_ORGANIZATIONS } from 'frontend/api/queries'

import PanelHeader from 'frontend/components/Panel/PanelHeader'
import Table from 'frontend/components/Table'
import PathwaysModal from 'frontend/components/BusinessObjectModal/PathwaysModal'
import { CONFIG_TABLE_WIDTH } from 'frontend/components/Table/tableWidths'
import MultiSelectColumnFilter from 'frontend/components/Table/custom-filters/MultiSelect/MultiSelectColumnFilter'
import customMultiSelectFilterFn from 'frontend/components/Table/custom-filters/MultiSelect/customMultiSelectFilterFn'
import Icon from 'frontend/components/Icon'
import Color from 'frontend/utils/color'
import createButtonStyle from 'frontend/components/BusinessObjectModal/PeopleModal/createButtonStyle'
import PathwaysModalButton from 'frontend/components/BusinessObjectModal/PathwaysModal/PathwaysModalButton'

const PAGE_TITLE = 'Pathways Accounts'

const MODAL_TO_COL_MAP = {
  slug: {
    Modal: PathwaysModal,
    idKey: '_id',
  },
  organization: {
    Modal: PathwaysModal,
    idKey: '_id',
  },
  organizationTiny: {
    Modal: PathwaysModal,
    idKey: '_id',
  },
}

const COLUMNS = [
  {
    Header: 'Slug',
    accessor: 'slug',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    width: 300,
  },
  {
    Header: 'Organization',
    accessor: 'organization',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    width: 300,
  },
  {
    Header: 'Short Name',
    accessor: 'organizationTiny',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    width: 300,
  },
]

const Accounts = () => {
  const { data, loading } = useQuery(GET_PATHWAYS_ORGANIZATIONS)

  if (loading) return null

  const { pathwaysOrganizations } = data

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <PanelHeader title={PAGE_TITLE}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <PathwaysModalButton buttonStyle={createButtonStyle}>
            <Icon
              iconName="add"
              color1={Color.WHITE}
              width={16}
              style={{ marginRight: 8 }}
            />
            Create Pathways
          </PathwaysModalButton>
        </div>
      </PanelHeader>
      <Table
        width={CONFIG_TABLE_WIDTH}
        data={pathwaysOrganizations}
        columns={COLUMNS}
        modalColMap={MODAL_TO_COL_MAP}
        exportProps={{
          filename: 'PathwaysAccounts',
          sheetName: 'Pathways Accounts',
        }}
      />
    </div>
  )
}

export default Accounts
