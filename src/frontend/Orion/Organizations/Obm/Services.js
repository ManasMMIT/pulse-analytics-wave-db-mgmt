import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import { GET_SERVICE_TEMPLATE_OBMS } from 'frontend/api/queries'

import PanelHeader from '../../../components/Panel/PanelHeader'

import ObmServicesModalButton from '../../../components/BusinessObjectModal/ObmServicesModal/ObmServicesModalButton'
import ObmServicesCategoriesModalButton from '../../../components/BusinessObjectModal/ObmServicesCategoriesModal/ObmServicesCategoriesModalButton'

import OncologyBenefitManagerModal from '../../../components/BusinessObjectModal/OncologyBenefitManagerModal'
import ObmServicesModal from '../../../components/BusinessObjectModal/ObmServicesModal'
import ObmServicesCategoriesModal from '../../../components/BusinessObjectModal/ObmServicesCategoriesModal'

import TemplateTable from './TemplateTable'
import MultiSelectColumnFilter from './TemplateTable/MultiSelectColumnFilter'
import NumberRangeColumnFilter from './TemplateTable/NumberRangeColumnFilter'

import customMultiSelectFilterFn from './TemplateTable/custom-filters/customMultiSelectFilterFn'

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

const PAGE_TITLE = 'Oncology Benefit Manager Account Services'

const MODAL_TO_COL_MAP = {
  organization: {
    Modal: OncologyBenefitManagerModal,
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
    Modal: OncologyBenefitManagerModal,
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
  },
  {
    Header: 'Service Rating',
    accessor: 'serviceRating',
    Filter: NumberRangeColumnFilter,
    filter: 'between',
  },
]

const COLUMNS2 = [
  {
    Header: 'Account',
    accessor: 'organization',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    sticky: 'left',
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
  },
  {
    Header: 'Service Rating',
    accessor: 'serviceRating',
    Filter: NumberRangeColumnFilter,
    filter: 'between',
  },
  {
    Header: 'Service Rating0',
    accessor: 'extra',
    Filter: NumberRangeColumnFilter,
    filter: 'between',
  },
  {
    Header: 'Service Rating1',
    accessor: 'extra1',
    Filter: NumberRangeColumnFilter,
    filter: 'between',
  },
  {
    Header: 'Service Rating2',
    accessor: 'extra2',
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
        flex: 1,
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
      <TemplateTable
        data={serviceTemplateData}
        columns={COLUMNS}
        modalColMap={MODAL_TO_COL_MAP}
      />
      <TemplateTable
        data={serviceTemplateData}
        columns={COLUMNS2}
        modalColMap={MODAL_TO_COL_MAP}
      />
    </div>
  )
}

export default Services
