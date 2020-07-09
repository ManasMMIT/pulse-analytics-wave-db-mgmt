import React from 'react'

import { GET_OBM_SERVICES } from 'frontend/api/queries'

import ObmServicesModal from 'frontend/components/BusinessObjectModal/ObmServicesModal'
import BoPowerSelect from 'frontend/components/BoPowerSelect/BoPowerSelect'

const ObmServicePowerSelect = () => (
  <BoPowerSelect
    placeholder={'Select OBM Service to Edit'}
    getLabel={({ name }) => name}
    queryDoc={GET_OBM_SERVICES}
    Modal={ObmServicesModal}
  />
)

export default ObmServicePowerSelect
