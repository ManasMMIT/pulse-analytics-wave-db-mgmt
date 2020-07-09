import React from 'react'

import { GET_OBM_ORGANIZATIONS } from 'frontend/api/queries'

import OncologyBenefitManagerModal from 'frontend/components/BusinessObjectModal/OncologyBenefitManagerModal'
import BoPowerSelect from 'frontend/components/BoPowerSelect/BoPowerSelect'

const ObmPowerSelect = () => (
  <BoPowerSelect
    placeholder={'Select OBM to Edit'}
    getLabel={({ organization }) => organization}
    queryDoc={GET_OBM_ORGANIZATIONS}
    Modal={OncologyBenefitManagerModal}
  />
)

export default ObmPowerSelect
