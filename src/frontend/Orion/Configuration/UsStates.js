import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import { GET_US_STATES } from 'frontend/api/queries'

import PanelHeader from 'frontend/components/Panel/PanelHeader'
import UsStatesModalButton from 'frontend/components/BusinessObjectModal/UsStatesModal/UsStatesModalButton'
import UsStatesModal from 'frontend/components/BusinessObjectModal/UsStatesModal'
import Icon from 'frontend/components/Icon'

import Color from 'frontend/utils/color'

import TemplateTable from '../Organizations/Obm/TemplateTable/'
import MultiSelectColumnFilter from '../Organizations/Obm/TemplateTable/custom-filters/MultiSelect/MultiSelectColumnFilter'
import NumberRangeColumnFilter from '../Organizations/Obm/TemplateTable/custom-filters/NumberRangeColumnFilter'
import customMultiSelectFilterFn from '../Organizations/Obm/TemplateTable/custom-filters/MultiSelect/customMultiSelectFilterFn'
import customBetweenPercentsFilterFn from '../Organizations/Obm/TemplateTable/custom-filters/customBetweenPercentsFilterFn'

import createButtonStyle from '../Organizations/Obm/create-button-style'
import FontSpace from 'frontend/utils/fontspace'

const percentageFormatter = (value, decimals = 0) => {
  // #toFixed may result in imperfect rounding,
  // example: 859.385 doesn't round correctly for two decimal places
  return [undefined, null].includes(value)
    ? null
    : `${(value * 100).toFixed(decimals)}%`
}

const PAGE_TITLE = 'US States'

const MODAL_TO_COL_MAP = {
  editAccessor: {
    Modal: UsStatesModal,
    idKey: '_id',
  },
}

const COLUMNS = [
  {
    Header: 'State',
    accessor: 'stateLong',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Books Impacted',
    accessor: 'booksImpacted',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    Cell: ({ value }) => (value || []).join(', '),
  },
  {
    Header: 'Law',
    accessor: 'law',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    width: 300,
    Cell: (props) => {
      const { lawLink, law } = props.cell.row.original

      if (lawLink && law) {
        return (
          <div>
            {law}
            <a
              href={lawLink}
              style={{
                color: Color.BLUE,
                display: 'block',
                ...FontSpace.FS3,
                width: 'fit-content',
              }}
              target="_blank"
            >
              link
            </a>
          </div>
        )
      }

      return props.value
    },
  },
  {
    Header: 'Bill',
    accessor: 'bill',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Survey Commercial Lives % Insured',
    accessor: 'surveyCommercialLivesPercentInsured',
    sortType: 'float',
    Cell: (props) => (
      <div style={{ textAlign: 'right' }}>
        {percentageFormatter(props.value, 2)}
      </div>
    ),
    sortType: 'float',
    Filter: NumberRangeColumnFilter,
    filter: customBetweenPercentsFilterFn,
  },
  {
    Header: '',
    disableSortBy: true,
    disableFilters: true,
    accessor: 'editAccessor',
    Cell: 'Edit',
    width: 50,
  },
]

const UsStates = () => {
  const { data, loading } = useQuery(GET_US_STATES)

  let usStates = []
  if (!loading) usStates = Object.values(data)[0] || []

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 'calc(100vw - 318px)',
      }}
    >
      <PanelHeader title={PAGE_TITLE}>
        <UsStatesModalButton buttonStyle={createButtonStyle}>
          <Icon
            iconName="add"
            color1={Color.WHITE}
            width={16}
            style={{ marginRight: 8 }}
          />
          Create US State
        </UsStatesModalButton>
      </PanelHeader>

      <TemplateTable
        data={usStates}
        columns={COLUMNS}
        modalColMap={MODAL_TO_COL_MAP}
        exportProps={{ filename: 'US_States', sheetName: 'states' }}
      />
    </div>
  )
}

export default UsStates
