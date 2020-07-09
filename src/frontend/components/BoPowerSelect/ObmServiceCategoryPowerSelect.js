import React from 'react'

import { GET_OBM_SERVICES_CATEGORIES } from 'frontend/api/queries'

import ObmServicesCategoriesModal from 'frontend/components/BusinessObjectModal/ObmServicesCategoriesModal'
import BoPowerSelect from 'frontend/components/BoPowerSelect/BoPowerSelect'

const ObmServiceCategoryPowerSelect = () => (
  <BoPowerSelect
    placeholder={'Select Service Category'}
    getLabel={({ name }) => name}
    queryDoc={GET_OBM_SERVICES_CATEGORIES}
    Modal={ObmServicesCategoriesModal}
  />
)

export default ObmServiceCategoryPowerSelect
