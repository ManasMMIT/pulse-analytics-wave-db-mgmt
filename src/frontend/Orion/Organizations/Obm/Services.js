import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import { GET_SERVICE_TEMPLATE_OBMS } from 'frontend/api/queries'

import PanelHeader from 'frontend/components/Panel/PanelHeader'
import ObmModal from 'frontend/components/BusinessObjectModal/OncologyBenefitManagerModal'
import ObmServicesModal from 'frontend/components/BusinessObjectModal/ObmServicesModal'
import ObmServicesCategoriesModal from 'frontend/components/BusinessObjectModal/ObmServicesCategoriesModal'
import ObmServicesModalButton from 'frontend/components/BusinessObjectModal/ObmServicesModal/ObmServicesModalButton'
import ObmServicesCategoriesModalButton from 'frontend/components/BusinessObjectModal/ObmServicesCategoriesModal/ObmServicesCategoriesModalButton'
import Icon from 'frontend/components/Icon'

import Color from 'frontend/utils/color'

import TemplateTable from './TemplateTable'
import MultiSelectColumnFilter from './TemplateTable/custom-filters/MultiSelect/MultiSelectColumnFilter'
import customMultiSelectFilterFn from './TemplateTable/custom-filters/MultiSelect/customMultiSelectFilterFn'
import NumberRangeColumnFilter from './TemplateTable/custom-filters/NumberRangeColumnFilter'

import createButtonStyle from './create-button-style'

const PAGE_TITLE = 'Oncology Benefit Manager Services'

const MODAL_TO_COL_MAP = {
  organization: {
    Modal: ObmModal,
    idKey: 'obmId',
  },
  serviceCategory: {
    Modal: ObmServicesCategoriesModal,
    idKey: 'serviceCategoryId',
  },
  service: {
    Modal: ObmServicesModal,
    idKey: 'serviceId',
  },
  serviceRating: {
    Modal: ObmModal,
    idKey: 'obmId',
  },
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
    Header: 'Service Category',
    accessor: 'serviceCategory',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    width: 280,
  },
  {
    Header: 'Service',
    accessor: 'service',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    width: 280,
  },
  {
    Header: 'Service Rating',
    accessor: 'serviceRating',
    Filter: NumberRangeColumnFilter,
    filter: 'between',
    Cell: (props) => <div style={{ textAlign: 'right' }}>{props.value}</div>,
  },
]

const Services = () => {
  const { data, loading } = useQuery(GET_SERVICE_TEMPLATE_OBMS)

  let serviceTemplateData = []
  if (data && !loading) serviceTemplateData = Object.values(data)[0] || []

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 'calc(100vw - 318px)',
      }}
    >
      <PanelHeader title={PAGE_TITLE}>
        <ObmServicesModalButton buttonStyle={createButtonStyle}>
          <Icon iconName="add" color1={Color.WHITE} width={16} style={{ marginRight: 8 }} />
          Create Service
        </ObmServicesModalButton>

        <ObmServicesCategoriesModalButton buttonStyle={{ ...createButtonStyle, marginLeft: 12 }}>
          <Icon iconName="add" color1={Color.WHITE} width={16} style={{ marginRight: 8 }} />
          Create Service Category
        </ObmServicesCategoriesModalButton>
      </PanelHeader>

      <TemplateTable
        data={serviceTemplateData}
        columns={COLUMNS}
        modalColMap={MODAL_TO_COL_MAP}
        exportProps={{ filename: 'ObmServices', sheetName: 'Services' }}
      />
    </div>
  )
}

export default Services
