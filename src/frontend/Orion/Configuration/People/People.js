import React from 'react'
import format from 'date-fns/format'
import _ from 'lodash'

import PanelHeader from 'frontend/components/Panel/PanelHeader'
import PeopleModalButton from 'frontend/components/BusinessObjectModal/PeopleModal/PeopleModalButton'
import PeopleModal from 'frontend/components/BusinessObjectModal/PeopleModal'
import Icon from 'frontend/components/Icon'
import Color from 'frontend/utils/color'

import TemplateTable from '../../Organizations/Obm/TemplateTable'
import MultiSelectColumnFilter from '../../Organizations/Obm/TemplateTable/custom-filters/MultiSelect/MultiSelectColumnFilter'
import customMultiSelectFilterFn from '../../Organizations/Obm/TemplateTable/custom-filters/MultiSelect/customMultiSelectFilterFn'

import createButtonStyle from '../../Organizations/Obm/create-button-style'

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
    sortType: 'text',
  },
  {
    Header: 'NPI #',
    accessor: 'nationalProviderIdentifier',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
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
        width: 'calc(100vw - 318px)',
      }}
    >
      <PanelHeader title={PAGE_TITLE}>
        <PeopleModalButton buttonStyle={createButtonStyle}>
          <Icon
            iconName="add"
            color1={Color.WHITE}
            width={16}
            style={{ marginRight: 8 }}
          />
          {CREATE_BTN_TXT}
        </PeopleModalButton>
      </PanelHeader>
      <TemplateTable
        data={orderedData}
        columns={COLUMNS}
        modalColMap={MODAL_TO_COL_MAP}
        exportProps={{ filename: 'Influencers', sheetName: 'Influencers' }}
      />
    </div>
  )
}

export default People
