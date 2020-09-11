import React from 'react'
import format from 'date-fns/format'
import _ from 'lodash'

import PanelHeader from 'frontend/components/Panel/PanelHeader'
import PeopleModalButton from 'frontend/components/BusinessObjectModal/PeopleModal/PeopleModalButton'
import PeopleModal from 'frontend/components/BusinessObjectModal/PeopleModal'
import Icon from 'frontend/components/Icon'
import Color from 'frontend/utils/color'

import { CONFIG_TABLE_WIDTH } from 'frontend/components/Table/tableWidths'
import Table from 'frontend/components/Table'
import MultiSelectColumnFilter from 'frontend/components/Table/custom-filters/MultiSelect/MultiSelectColumnFilter'
import customMultiSelectFilterFn from 'frontend/components/Table/custom-filters/MultiSelect/customMultiSelectFilterFn'

import peopleModalButtonStyle from 'frontend/components/BusinessObjectModal/PeopleModal/peopleModalButtonStyle'

import usePeople from './usePeople'

const PAGE_TITLE = 'People'
const CREATE_BTN_TXT = 'Create Person'

const MODAL_TO_COL_MAP = {
  editAccessor: {
    Modal: PeopleModal,
    idKey: '_id',
  },
}

const COLUMNS = [
  {
    Header: 'Date Updated',
    accessor: 'updatedOn',
    Cell: (props) => format(new Date(props.value), 'M/d/yyyy h:mm:ss a'),
    disableFilters: true,
    width: 180,
    sticky: 'left',
  },
  {
    Header: 'First Name',
    accessor: 'firstName',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    sticky: 'left',
  },
  {
    Header: 'Last Name',
    accessor: 'lastName',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    sticky: 'left',
  },
  {
    Header: 'Internal ID',
    accessor: '_id',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
  },
  {
    Header: 'NPI #',
    accessor: 'nationalProviderIdentifier',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
  },
  {
    Header: 'Physician Profile ID',
    accessor: 'physicianProfileId',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
  },
  {
    Header: 'Pathways Data',
    accessor: 'hasPathwaysData',
    disableFilters: true,
    sortType: 'bool',
    Cell: ({ value }) => (value ? 'Yes' : 'No'),
    width: 100,
  },
  {
    Header: 'Provider Data',
    accessor: 'hasProviderData',
    disableFilters: true,
    sortType: 'bool',
    Cell: ({ value }) => (value ? 'Yes' : 'No'),
    width: 100,
  },
  {
    Header: 'Obm Data',
    accessor: 'hasObmData',
    disableFilters: true,
    sortType: 'bool',
    Cell: ({ value }) => (value ? 'Yes' : 'No'),
    width: 100,
  },
  {
    Header: '',
    disableSortBy: true,
    disableFilters: true,
    accessor: 'editAccessor',
    Cell: 'Edit',
  },
]

const People = () => {
  const { data } = usePeople()

  const orderedData = _.orderBy(
    data,
    ({ updatedOn }) => new Date(updatedOn),
    'desc'
  )

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <PanelHeader title={PAGE_TITLE}>
        <PeopleModalButton buttonStyle={peopleModalButtonStyle}>
          <Icon
            iconName="add"
            color1={Color.WHITE}
            width={16}
            style={{ marginRight: 8 }}
          />
          {CREATE_BTN_TXT}
        </PeopleModalButton>
      </PanelHeader>
      <Table
        width={CONFIG_TABLE_WIDTH}
        data={orderedData}
        columns={COLUMNS}
        modalColMap={MODAL_TO_COL_MAP}
        exportProps={{ filename: 'Influencers', sheetName: 'Influencers' }}
      />
    </div>
  )
}

export default People
