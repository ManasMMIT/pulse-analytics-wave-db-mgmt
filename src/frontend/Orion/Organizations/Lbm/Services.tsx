import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import { GET_VIEW_LBM_SERVICES } from 'frontend/api/queries'

import PanelHeader from 'frontend/components/Panel/PanelHeader'
import LbmModal from 'frontend/components/BusinessObjectModal/LbmModal'
import LbmServicesModal from 'frontend/components/BusinessObjectModal/LbmServicesModal'
import LbmServicesCategoriesModal from 'frontend/components/BusinessObjectModal/LbmServicesCategoriesModal'
import LbmPowerSelect from 'frontend/components/BoPowerSelect/LbmPowerSelect'
import LbmServicePowerSelect from 'frontend/components/BoPowerSelect/LbmServicePowerSelect'
import LbmServiceCategoryPowerSelect from 'frontend/components/BoPowerSelect/LbmServiceCategoryPowerSelect'

import Table from 'frontend/components/Table'

import { CONFIG_TABLE_WIDTH } from 'frontend/components/Table/tableWidths'
import MultiSelectColumnFilter from 'frontend/components/Table/custom-filters/MultiSelect/MultiSelectColumnFilter'
import customMultiSelectFilterFn from 'frontend/components/Table/custom-filters/MultiSelect/customMultiSelectFilterFn'
import NumberRangeColumnFilter from 'frontend/components/Table/custom-filters/NumberRangeColumnFilter'

const PAGE_TITLE = 'Laboratory Benefit Manager Services'

const MODAL_TO_COL_MAP = {
  organization: {
    Modal: LbmModal,
    idKey: 'lbmId',
  },
  serviceCategory: {
    Modal: LbmServicesCategoriesModal,
    idKey: 'serviceCategoryId',
  },
  service: {
    Modal: LbmServicesModal,
    idKey: 'serviceId',
  },
  serviceRating: {
    Modal: LbmModal,
    idKey: 'lbmId',
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
    Cell: (props: { value: string }) => <div style={{ textAlign: 'right' }}>{props.value}</div>,
  },
]

const Services = () => {
  const { data, loading } = useQuery(GET_VIEW_LBM_SERVICES)

  let serviceTemplateData: any = []
  if (data && !loading) serviceTemplateData = Object.values(data)[0] || []

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <PanelHeader title={PAGE_TITLE}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <LbmPowerSelect />
          <LbmServicePowerSelect />
          <LbmServiceCategoryPowerSelect />
        </div>
      </PanelHeader>

      <Table
        width={CONFIG_TABLE_WIDTH}
        data={serviceTemplateData}
        columns={COLUMNS}
        modalColMap={MODAL_TO_COL_MAP}
        exportProps={{ filename: 'LbmServices', sheetName: 'Services' }}
      />
    </div>
  )
}

export default Services
