import React from 'react'

import { useQuery } from '@apollo/react-hooks'

import { GET_APM_ORGANIZATIONS } from 'frontend/api/queries'

import PanelHeader from 'frontend/components/Panel/PanelHeader'
import Table from 'frontend/components/Table'
import ApmsModal from 'frontend/components/BusinessObjectModal/ApmsModal'
import { CONFIG_TABLE_WIDTH } from 'frontend/components/Table/tableWidths'
import MultiSelectColumnFilter from 'frontend/components/Table/custom-filters/MultiSelect/MultiSelectColumnFilter'
import customMultiSelectFilterFn from 'frontend/components/Table/custom-filters/MultiSelect/customMultiSelectFilterFn'
import Icon from 'frontend/components/Icon'
import Color from 'frontend/utils/color'
import createButtonStyle from 'frontend/components/BusinessObjectModal/PeopleModal/createButtonStyle'
import ApmsModalButton from 'frontend/components/BusinessObjectModal/ApmsModal/ApmsModalButton'

const PAGE_TITLE = 'Alternative Payment Model Accounts'

const MODAL_TO_COL_MAP = {
  slug: {
    Modal: ApmsModal,
    idKey: '_id',
  },
  organization: {
    Modal: ApmsModal,
    idKey: '_id',
  },
  organizationTiny: {
    Modal: ApmsModal,
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
  const { data, loading } = useQuery(GET_APM_ORGANIZATIONS)

  if (loading) return null

  const { apmOrganizations } = data

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <PanelHeader title={PAGE_TITLE}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ApmsModalButton buttonStyle={createButtonStyle}>
            <Icon
              iconName="add"
              color1={Color.WHITE}
              width={16}
              style={{ marginRight: 8 }}
            />
            Create APM
          </ApmsModalButton>
        </div>
      </PanelHeader>
      <Table
        width={CONFIG_TABLE_WIDTH}
        data={apmOrganizations}
        columns={COLUMNS}
        modalColMap={MODAL_TO_COL_MAP}
        exportProps={{
          filename: 'ApmAccounts',
          sheetName: 'Apm Accounts',
        }}
      />
    </div>
  )
}

export default Accounts
