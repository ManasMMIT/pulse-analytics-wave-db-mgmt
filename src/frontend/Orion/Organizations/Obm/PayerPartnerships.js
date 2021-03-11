import React from 'react'
import { useQuery } from '@apollo/client'

import { GET_VIEW_OBM_PAYER_PARTNERSHIPS } from 'frontend/api/queries'

import PanelHeader from 'frontend/components/Panel/PanelHeader'
import ObmModal from 'frontend/components/BusinessObjectModal/OncologyBenefitManagerModal'
import ObmPowerSelect from 'frontend/components/BoPowerSelect/ObmPowerSelect'
import Table from 'frontend/components/Table'

import { CONFIG_TABLE_WIDTH } from 'frontend/components/Table/tableWidths'
import MultiSelectColumnFilter from 'frontend/components/Table/custom-filters/MultiSelect/MultiSelectColumnFilter'
import customMultiSelectFilterFn from 'frontend/components/Table/custom-filters/MultiSelect/customMultiSelectFilterFn'
import NumberRangeColumnFilter from 'frontend/components/Table/custom-filters/NumberRangeColumnFilter'
import customBetweenPercentsFilterFn from 'frontend/components/Table/custom-filters/customBetweenPercentsFilterFn'

const percentageFormatter = (value, decimals = 0) =>
  // #toFixed may result in imperfect rounding,
  // example: 859.385 doesn't round correctly for two decimal places
  [undefined, null].includes(value)
    ? null
    : `${(value * 100).toFixed(decimals)}%`

const numberFormatter = (value) =>
  typeof value === 'number' && !isNaN(value) ? value.toLocaleString() : null

const PAGE_TITLE = 'Oncology Benefit Manager Payer Partnerships'

const MODAL_TO_COL_MAP = {
  obmOrganization: {
    Modal: ObmModal,
    idKey: 'obmId',
  },
}

const showDashIfNull = (value) => (value === null ? '-' : value)

const formatLivesCell = ({ value }) => (
  <div style={{ textAlign: 'right' }}>
    {showDashIfNull(numberFormatter(value))}
  </div>
)

const formatLivesPercentCell = ({ value }) => (
  <div style={{ textAlign: 'right' }}>
    {showDashIfNull(percentageFormatter(value, 2))}
  </div>
)

const formatReachCell = ({ value }) => showDashIfNull(value)

const COLUMNS = [
  {
    Header: 'Account',
    accessor: 'obmOrganization',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    sticky: 'left',
    width: 200,
  },
  {
    Header: 'Payer Participant',
    accessor: 'payerOrganization',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    sticky: 'left',
    width: 200,
  },
  {
    Header: 'Payer Slug',
    accessor: 'payerSlug',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Commercial Reach',
    accessor: 'commercialReach',
    Cell: formatReachCell,
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    width: 200,
  },
  {
    Header: 'Commercial Medical Lives',
    accessor: 'commercialMedicalLives',
    Cell: formatLivesCell,
    Filter: NumberRangeColumnFilter,
    filter: 'between',
  },
  {
    Header: 'Commercial Medical Lives Percent',
    accessor: 'commercialMedicalLivesPercent',
    Cell: formatLivesPercentCell,
    sortType: 'float',
    Filter: NumberRangeColumnFilter,
    filter: customBetweenPercentsFilterFn,
  },
  {
    Header: 'Medicare Reach',
    accessor: 'medicareReach',
    Cell: formatReachCell,
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    width: 200,
  },
  {
    Header: 'Medicare Medical Lives',
    accessor: 'medicareMedicalLives',
    Cell: formatLivesCell,
    Filter: NumberRangeColumnFilter,
    filter: 'between',
  },
  {
    Header: 'Medicare Medical Lives Percent',
    accessor: 'medicareMedicalLivesPercent',
    Cell: formatLivesPercentCell,
    sortType: 'float',
    Filter: NumberRangeColumnFilter,
    filter: customBetweenPercentsFilterFn,
  },
  {
    Header: 'Managed Medicaid Reach',
    accessor: 'managedMedicaidReach',
    Cell: formatReachCell,
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    width: 200,
  },
  {
    Header: 'Medicaid Medical Lives',
    accessor: 'managedMedicaidMedicalLives',
    Cell: formatLivesCell,
    Filter: NumberRangeColumnFilter,
    filter: 'between',
  },
  {
    Header: 'Medicaid Medical Lives Percent',
    accessor: 'managedMedicaidMedicalLivesPercent',
    Cell: formatLivesPercentCell,
    sortType: 'float',
    Filter: NumberRangeColumnFilter,
    filter: customBetweenPercentsFilterFn,
  },
]

const PayerPartnerships = () => {
  const { data, loading } = useQuery(GET_VIEW_OBM_PAYER_PARTNERSHIPS)

  let payerPartnershipsData = []
  if (data && !loading) payerPartnershipsData = Object.values(data)[0] || []

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <PanelHeader
        title={PAGE_TITLE}
        headerContainerStyle={{ flex: '0 0 auto' }}
      >
        <ObmPowerSelect />
      </PanelHeader>

      <Table
        width={CONFIG_TABLE_WIDTH}
        data={payerPartnershipsData}
        columns={COLUMNS}
        modalColMap={MODAL_TO_COL_MAP}
        exportProps={{
          filename: 'ObmPayerPartnerships',
          sheetName: 'Payer Partnerships',
        }}
      />
    </div>
  )
}

export default PayerPartnerships
