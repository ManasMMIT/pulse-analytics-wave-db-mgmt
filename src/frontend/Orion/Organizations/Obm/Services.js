import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import { GET_SERVICE_TEMPLATE_OBMS } from 'frontend/api/queries'

import PanelHeader from '../../../components/Panel/PanelHeader'
import ObmModalButton from '../../../components/BusinessObjectModal/OncologyBenefitManagerModal/OncologyBenefitManagerModalButton'
import ObmServicesModalButton from '../../../components/BusinessObjectModal/ObmServicesModal/ObmServicesModalButton'
import ObmServicesCategoriesModalButton from '../../../components/BusinessObjectModal/ObmServicesCategoriesModal/ObmServicesCategoriesModalButton'

import TemplateTable from './TemplateTable'
import SelectColumnFilter from './TemplateTable/SelectColumnFilter'
import MultiSelectColumnFilter from './TemplateTable/MultiSelectColumnFilter'

import customMultiSelectFilterFn from './TemplateTable/custom-filters/customMultiSelectFilterFn'
import customSelectNumberFilterFn from './TemplateTable/custom-filters/customSelectNumberFilterFn'

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
    Modal: ObmModalButton,
    idKey: 'obmId',
  },
  serviceCategory: {
    Modal: ObmServicesCategoriesModalButton,
    idKey: 'serviceCategoryId',
  },
  service: {
    Modal: ObmServicesModalButton,
    idKey: 'serviceId',
  },
  serviceRating: {
    Modal: ObmModalButton,
    idKey: 'obmId',
  },
}

const Services = () => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Account',
        accessor: 'organization',
        Filter: MultiSelectColumnFilter,
        filter: customMultiSelectFilterFn,
      },
      {
        Header: 'Service Category',
        accessor: 'serviceCategory',
        Filter: MultiSelectColumnFilter,
        filter: customMultiSelectFilterFn,
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
        Filter: SelectColumnFilter,
        filter: customSelectNumberFilterFn,
      },
    ],
    []
  )

  const { data, loading } = useQuery(GET_SERVICE_TEMPLATE_OBMS)

  let serviceTemplateData = []
  if (data && !loading) serviceTemplateData = Object.values(data)[0] || []

  return (
    <div style={{ width: '100%' }}>
      <PanelHeader title={PAGE_TITLE}>
        <ObmServicesModalButton buttonStyle={createButtonStyle}>
          Create Service
        </ObmServicesModalButton>
        <ObmServicesCategoriesModalButton buttonStyle={createButtonStyle}>
          Create Service Category
        </ObmServicesCategoriesModalButton>
      </PanelHeader>
      <TemplateTable
        columns={columns}
        data={serviceTemplateData}
        modalColMap={MODAL_TO_COL_MAP}
      />
    </div>
  )
}

export default Services
