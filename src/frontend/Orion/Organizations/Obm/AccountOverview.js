import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import { GET_OBM_ORGANIZATIONS } from 'frontend/api/queries'

import PanelHeader from 'frontend/components/Panel/PanelHeader'
import ObmModalButton from 'frontend/components/BusinessObjectModal/OncologyBenefitManagerModal/OncologyBenefitManagerModalButton'
import ObmModal from 'frontend/components/BusinessObjectModal/OncologyBenefitManagerModal'
// import ObmTypesModal from 'frontend/components/BusinessObjectModal/ObmTypesModal'
import ObmTypePowerSelect from 'frontend/components/BoPowerSelect/ObmTypePowerSelect'
import Icon from 'frontend/components/Icon'
import Table from 'frontend/components/Table'

import Color from 'frontend/utils/color'

import { CONFIG_TABLE_WIDTH } from 'frontend/components/Table/tableWidths'
import NumberRangeColumnFilter from 'frontend/components/Table/custom-filters/NumberRangeColumnFilter'
import MultiSelectColumnFilter from 'frontend/components/Table/custom-filters/MultiSelect/MultiSelectColumnFilter'
import customMultiSelectFilterFn from 'frontend/components/Table/custom-filters/MultiSelect/customMultiSelectFilterFn'

import createButtonStyle from 'frontend/components/BusinessObjectModal/PeopleModal/createButtonStyle'

const PAGE_TITLE = 'Oncology Benefit Manager Account Overview'

const MODAL_TO_COL_MAP = {
  organization: { Modal: ObmModal, idKey: '_id' },
  start: { Modal: ObmModal, idKey: '_id' },
  businessModel: { Modal: ObmModal, idKey: '_id' },
}

const COLUMNS = [
  {
    Header: 'Account',
    accessor: 'organization',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    width: 200,
  },
  {
    Header: 'Start',
    accessor: 'start',
    Filter: NumberRangeColumnFilter,
    filter: 'between',
    Cell: (props) => <div style={{ textAlign: 'right' }}>{props.value}</div>,
  },
  {
    Header: 'Business Model',
    accessor: 'businessModel',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    width: 500,
  },
]

const AccountOverview = () => {
  const { data, loading } = useQuery(GET_OBM_ORGANIZATIONS)

  let obms = []
  if (!loading) obms = Object.values(data)[0] || []

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <PanelHeader title={PAGE_TITLE}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ObmTypePowerSelect />
          <ObmModalButton buttonStyle={createButtonStyle}>
            <Icon
              iconName="add"
              color1={Color.WHITE}
              width={16}
              style={{ marginRight: 8 }}
            />
            Create OBM
          </ObmModalButton>
        </div>
      </PanelHeader>

      <Table
        width={CONFIG_TABLE_WIDTH}
        data={obms}
        columns={COLUMNS}
        modalColMap={MODAL_TO_COL_MAP}
        exportProps={{
          filename: 'ObmAccountOverview',
          sheetName: 'Account Overview',
        }}
      />
    </div>
  )
}

export default AccountOverview
