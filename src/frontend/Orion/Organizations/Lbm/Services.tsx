import React from 'react'
// import { useQuery } from '@apollo/react-hooks'

// import { GET_VIEW_OBM_SERVICES } from 'frontend/api/queries'

import PanelHeader from 'frontend/components/Panel/PanelHeader'
// import LbmModal from 'frontend/components/BusinessObjectModal/OncologyBenefitManagerModal'
// import LbmServicesModal from 'frontend/components/BusinessObjectModal/LbmServicesModal'
// import LbmServicesCategoriesModal from 'frontend/components/BusinessObjectModal/LbmServicesCategoriesModal'
// import LbmServicesModalButton from 'frontend/components/BusinessObjectModal/LbmServicesModal/LbmServicesModalButton'
// import LbmServicesCategoriesModalButton from 'frontend/components/BusinessObjectModal/LbmServicesCategoriesModal/LbmServicesCategoriesModalButton'
import LbmPowerSelect from 'frontend/components/BoPowerSelect/LbmPowerSelect'
import LbmServicePowerSelect from 'frontend/components/BoPowerSelect/LbmServicePowerSelect'
import LbmServiceCategoryPowerSelect from 'frontend/components/BoPowerSelect/LbmServiceCategoryPowerSelect'
import UnderConstruction from 'frontend/components/UnderConstruction'

// import Icon from 'frontend/components/Icon'
// import Table from 'frontend/components/Table'

// import Color from 'frontend/utils/color'

// import { CONFIG_TABLE_WIDTH } from 'frontend/components/Table/tableWidths'
// import MultiSelectColumnFilter from 'frontend/components/Table/custom-filters/MultiSelect/MultiSelectColumnFilter'
// import customMultiSelectFilterFn from 'frontend/components/Table/custom-filters/MultiSelect/customMultiSelectFilterFn'
// import NumberRangeColumnFilter from 'frontend/components/Table/custom-filters/NumberRangeColumnFilter'

// import createButtonStyle from 'frontend/components/BusinessObjectModal/PeopleModal/createButtonStyle'

const PAGE_TITLE = 'Laboratory Benefit Manager Services'

// const MODAL_TO_COL_MAP = {
//   organization: {
//     Modal: LbmModal,
//     idKey: 'lbmId',
//   },
//   serviceCategory: {
//     Modal: LbmServicesCategoriesModal,
//     idKey: 'serviceCategoryId',
//   },
//   service: {
//     Modal: LbmServicesModal,
//     idKey: 'serviceId',
//   },
//   serviceRating: {
//     Modal: LbmModal,
//     idKey: 'lbmId',
//   },
// }

// const COLUMNS = [
//   {
//     Header: 'Account',
//     accessor: 'organization',
//     Filter: MultiSelectColumnFilter,
//     filter: customMultiSelectFilterFn,
//     sortType: 'text',
//     width: 200,
//   },
//   {
//     Header: 'Service Category',
//     accessor: 'serviceCategory',
//     Filter: MultiSelectColumnFilter,
//     filter: customMultiSelectFilterFn,
//     sortType: 'text',
//     width: 280,
//   },
//   {
//     Header: 'Service',
//     accessor: 'service',
//     Filter: MultiSelectColumnFilter,
//     filter: customMultiSelectFilterFn,
//     sortType: 'text',
//     width: 280,
//   },
//   {
//     Header: 'Service Rating',
//     accessor: 'serviceRating',
//     Filter: NumberRangeColumnFilter,
//     filter: 'between',
//     Cell: (props) => <div style={{ textAlign: 'right' }}>{props.value}</div>,
//   },
// ]

const Services = () => {
  // const { data, loading } = useQuery(GET_VIEW_OBM_SERVICES)

  // let serviceTemplateData = []
  // if (data && !loading) serviceTemplateData = Object.values(data)[0] || []

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
          {/* <LbmServicesModalButton buttonStyle={createButtonStyle}>
            <Icon
              iconName="add"
              color1={Color.WHITE}
              width={16}
              style={{ marginRight: 8 }}
            />
            Create Service
          </LbmServicesModalButton>

          <LbmServicesCategoriesModalButton
            buttonStyle={{ ...createButtonStyle, marginLeft: 12 }}
          >
            <Icon
              iconName="add"
              color1={Color.WHITE}
              width={16}
              style={{ marginRight: 8 }}
            />
            Create Service Category
          </LbmServicesCategoriesModalButton> */}
        </div>
      </PanelHeader>

      <UnderConstruction />

      {/* <Table
        width={CONFIG_TABLE_WIDTH}
        data={serviceTemplateData}
        columns={COLUMNS}
        modalColMap={MODAL_TO_COL_MAP}
        exportProps={{ filename: 'LbmServices', sheetName: 'Services' }}
      /> */}
    </div>
  )
}

export default Services
