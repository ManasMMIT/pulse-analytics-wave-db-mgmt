import React from 'react'

import { GET_LBM_ORGANIZATIONS } from 'frontend/api/queries'

import LbmModal from 'frontend/components/BusinessObjectModal/LbmModal'
import BoPowerSelect from 'frontend/components/BoPowerSelect/BoPowerSelect'

const LbmPowerSelect = () => (
  <BoPowerSelect
    placeholder={'Select LBM'}
    getLabel={({ organization }: { organization: string }) => organization}
    queryDoc={GET_LBM_ORGANIZATIONS}
    Modal={LbmModal}
  />
)

export default LbmPowerSelect
