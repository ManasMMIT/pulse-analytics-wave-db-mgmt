import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import { GET_SERVICE_TEMPLATE_OBMS } from 'frontend/api/queries'

import PanelHeader from '../../../components/Panel/PanelHeader'
import ObmModal from '../../../components/BusinessObjectModal/OncologyBenefitManagerModal'
import ObmServicesModal from '../../../components/BusinessObjectModal/ObmServicesModal'
import ObmServicesCategoriesModal from '../../../components/BusinessObjectModal/ObmServicesCategoriesModal'
import ObmServicesModalButton from '../../../components/BusinessObjectModal/ObmServicesModal/ObmServicesModalButton'
import ObmServicesCategoriesModalButton from '../../../components/BusinessObjectModal/ObmServicesCategoriesModal/ObmServicesCategoriesModalButton'

import TemplateTable from './TemplateTable'
import MultiSelectColumnFilter from './TemplateTable/custom-filters/MultiSelect/MultiSelectColumnFilter'
import customMultiSelectFilterFn from './TemplateTable/custom-filters/MultiSelect/customMultiSelectFilterFn'
import NumberRangeColumnFilter from './TemplateTable/custom-filters/NumberRangeColumnFilter'

import Color from './../../../utils/color'

const createButtonStyle = {
  background: Color.PRIMARY,
  color: Color.WHITE,
  fontWeight: 700,
  margin: 12,
  padding: 12,
  borderRadius: 4,
  cursor: 'pointer',
}

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
  },
  {
    Header: 'Service Category',
    accessor: 'serviceCategory',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Service',
    accessor: 'service',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Service Rating',
    accessor: 'serviceRating',
    Filter: NumberRangeColumnFilter,
    filter: 'between',
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
          Create Service
        </ObmServicesModalButton>
        <ObmServicesCategoriesModalButton buttonStyle={createButtonStyle}>
          Create Service Category
        </ObmServicesCategoriesModalButton>
      </PanelHeader>
      <TemplateTable data={serviceTemplateData} columns={COLUMNS} modalColMap={MODAL_TO_COL_MAP} />
    </div>
  )
}

export default Services
