import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import format from 'date-fns/format'

import { GET_PEOPLE } from 'frontend/api/queries'

import PanelHeader from 'frontend/components/Panel/PanelHeader'
import PeopleModalButton from 'frontend/components/BusinessObjectModal/PeopleModal/PeopleModalButton'
import PeopleModal from 'frontend/components/BusinessObjectModal/PeopleModal'

import TemplateTable from '../Organizations/Obm/TemplateTable'
import MultiSelectColumnFilter from '../Organizations/Obm/TemplateTable/custom-filters/MultiSelect/MultiSelectColumnFilter'
import customMultiSelectFilterFn from '../Organizations/Obm/TemplateTable/custom-filters/MultiSelect/customMultiSelectFilterFn'

import Color from 'frontend/utils/color'

const createButtonStyle = {
  background: Color.PRIMARY,
  color: Color.WHITE,
  fontWeight: 700,
  margin: 12,
  padding: 12,
  borderRadius: 4,
  cursor: 'pointer',
}

const editButtonStyle = {
  background: Color.LIGHT_BLUE_GRAY_2,
  color: Color.PRIMARY,
  fontWeight: 700,
  margin: 12,
  padding: '6px 12px',
  borderRadius: 4,
  cursor: 'pointer',
}

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
    Cell: (props) => format(new Date(props.value), 'M/d/yy'),
    disableFilters: true,
  },
  {
    Header: 'First Name',
    accessor: 'firstName',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Last Name',
    accessor: 'lastName',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
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
    Header: '',
    disableSortBy: true,
    disableFilters: true,
    accessor: 'editAccessor',
    Cell: ({ cell: { getCellProps } }) => {
      const props = getCellProps()

      return (
        <div style={editButtonStyle} {...props}>
          Edit
        </div>
      )
    },
  },
]

const People = () => {
  const { data, loading } = useQuery(GET_PEOPLE)

  let influencerTemplateData = []
  if (data && !loading) influencerTemplateData = Object.values(data)[0] || []

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 'calc(100vw - 318px)',
      }}
    >
      <PanelHeader title={PAGE_TITLE}>
        <PeopleModalButton buttonStyle={createButtonStyle}>{CREATE_BTN_TXT}</PeopleModalButton>
      </PanelHeader>
      <TemplateTable
        data={influencerTemplateData}
        columns={COLUMNS}
        modalColMap={MODAL_TO_COL_MAP}
        exportProps={{ filename: 'Influencers', sheetName: 'Influencers' }}
      />
    </div>
  )
}

export default People
