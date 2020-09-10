import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import { GET_VIEW_OBM_SERVICES } from 'frontend/api/queries'

import PanelHeader from 'frontend/components/Panel/PanelHeader'
import ObmModal from 'frontend/components/BusinessObjectModal/OncologyBenefitManagerModal'
import ObmServicesModal from 'frontend/components/BusinessObjectModal/ObmServicesModal'
import ObmServicesCategoriesModal from 'frontend/components/BusinessObjectModal/ObmServicesCategoriesModal'
import ObmServicesModalButton from 'frontend/components/BusinessObjectModal/ObmServicesModal/ObmServicesModalButton'
import ObmServicesCategoriesModalButton from 'frontend/components/BusinessObjectModal/ObmServicesCategoriesModal/ObmServicesCategoriesModalButton'
import ObmPowerSelect from 'frontend/components/BoPowerSelect/ObmPowerSelect'
import ObmServicePowerSelect from 'frontend/components/BoPowerSelect/ObmServicePowerSelect'
import ObmServiceCategoryPowerSelect from 'frontend/components/BoPowerSelect/ObmServiceCategoryPowerSelect'
import Icon from 'frontend/components/Icon'
import Table from 'frontend/components/Table'

import Color from 'frontend/utils/color'

import { CONFIG_TABLE_WIDTH } from 'frontend/components/Table/tableWidths'
import MultiSelectColumnFilter from 'frontend/components/Table/custom-filters/MultiSelect/MultiSelectColumnFilter'
import customMultiSelectFilterFn from 'frontend/components/Table/custom-filters/MultiSelect/customMultiSelectFilterFn'
import NumberRangeColumnFilter from 'frontend/components/Table/custom-filters/NumberRangeColumnFilter'

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
  const { data, loading } = useQuery(GET_VIEW_OBM_SERVICES)

  let serviceTemplateData = []
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
          <ObmPowerSelect />
          <ObmServicePowerSelect />
          <ObmServiceCategoryPowerSelect />
          <ObmServicesModalButton buttonStyle={createButtonStyle}>
            <Icon
              iconName="add"
              color1={Color.WHITE}
              width={16}
              style={{ marginRight: 8 }}
            />
            Create Service
          </ObmServicesModalButton>

          <ObmServicesCategoriesModalButton
            buttonStyle={{ ...createButtonStyle, marginLeft: 12 }}
          >
            <Icon
              iconName="add"
              color1={Color.WHITE}
              width={16}
              style={{ marginRight: 8 }}
            />
            Create Service Category
          </ObmServicesCategoriesModalButton>
        </div>
      </PanelHeader>

      <Table
        width={CONFIG_TABLE_WIDTH}
        data={serviceTemplateData}
        columns={COLUMNS}
        modalColMap={MODAL_TO_COL_MAP}
        exportProps={{ filename: 'ObmServices', sheetName: 'Services' }}
      />
    </div>
  )
}

export default Services
