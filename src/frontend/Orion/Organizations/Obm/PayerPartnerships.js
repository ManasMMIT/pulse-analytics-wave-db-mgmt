import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import { GET_OBM_PAYER_PARTNERSHIPS } from 'frontend/api/queries'

import PanelHeader from 'frontend/components/Panel/PanelHeader'
import ObmModal from 'frontend/components/BusinessObjectModal/OncologyBenefitManagerModal'

import TemplateTable from './TemplateTable'
import MultiSelectColumnFilter from './TemplateTable/custom-filters/MultiSelect/MultiSelectColumnFilter'
import customMultiSelectFilterFn from './TemplateTable/custom-filters/MultiSelect/customMultiSelectFilterFn'
import NumberRangeColumnFilter from './TemplateTable/custom-filters/NumberRangeColumnFilter'

const percentageFormatter = (value, decimals = 0) =>
  // #toFixed may result in imperfect rounding,
  // example: 859.385 doesn't round correctly for two decimal places
  [undefined, null].includes(value) ? null : `${(value * 100).toFixed(decimals)}%`

const PAGE_TITLE = 'Oncology Benefit Manager Payer Partnerships'

const MODAL_TO_COL_MAP = {
  obmOrganization: {
    Modal: ObmModal,
    idKey: 'obmId',
  },
}

const COLUMNS = [
  {
    Header: 'Account',
    accessor: 'obmOrganization',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    sticky: 'left',
  },
  {
    Header: 'Payer Participant',
    accessor: 'payerOrganization',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    sticky: 'left',
  },
  {
    Header: 'Payer Slug',
    accessor: 'payerSlug',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Commercial Medical Lives',
    accessor: 'commercialMedicalLives',
    Filter: NumberRangeColumnFilter,
    filter: 'between',
  },
  {
    Header: 'Commercial Medical Lives Percent',
    accessor: 'commercialMedicalLivesPercent',
    Cell: (props) => percentageFormatter(props.value, 2),
    sortType: 'basic',
    // Filter: NumberRangeColumnFilter,
    // filter: 'between',
  },
  {
    Header: 'Medicare Medical Lives',
    accessor: 'medicareMedicalLives',
    Filter: NumberRangeColumnFilter,
    filter: 'between',
  },
  {
    Header: 'Medicare Medical Lives Percent',
    accessor: 'medicareMedicalLivesPercent',
    Cell: (props) => percentageFormatter(props.value, 2),
    sortType: 'basic',
    // Filter: NumberRangeColumnFilter,
    // filter: 'between',
  },
  {
    Header: 'Medicaid Medical Lives',
    accessor: 'managedMedicaidMedicalLives',
    Filter: NumberRangeColumnFilter,
    filter: 'between',
  },
  {
    Header: 'Medicaid Medical Lives Percent',
    accessor: 'managedMedicaidMedicalLivesPercent',
    Cell: (props) => percentageFormatter(props.value, 2),
    sortType: 'basic',
    // Filter: NumberRangeColumnFilter,
    // filter: 'between',
  },
]

const PayerPartnerships = () => {
  const { data, loading } = useQuery(GET_OBM_PAYER_PARTNERSHIPS)

  let payerPartnershipsData = []
  if (data && !loading) payerPartnershipsData = Object.values(data)[0] || []

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 'calc(100vw - 318px)',
      }}
    >
      <PanelHeader title={PAGE_TITLE} headerContainerStyle={{ flex: '0 0 auto' }} />

      <TemplateTable
        data={payerPartnershipsData}
        columns={COLUMNS}
        modalColMap={MODAL_TO_COL_MAP}
      />
    </div>
  )
}

export default PayerPartnerships
