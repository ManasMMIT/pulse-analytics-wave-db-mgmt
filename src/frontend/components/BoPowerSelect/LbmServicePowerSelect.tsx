import React, { useState } from 'react'

import LbmServicesModal from 'frontend/components/BusinessObjectModal/LbmServicesModal'
import { GET_LBM_SERVICES } from 'frontend/api/queries'
import BoPowerSelectNew from './BoPowerSelectNew'

const LbmServicePowerSelect = () => {
  const [selectedId, selectId] = useState<string | null>(null)
  const [isModalOpen, openModal] = useState(false)

  const changeHandler = ({ value }: { value: string }) => {
    selectId(value)
    openModal(true)
  }

  const closeModalHandler = () => {
    selectId(null)
    openModal(false)
  }

  const createOptionConfig = {
    clickHandler: () => openModal(true),
    createOptionText: 'Create Service',
  }

  return (
    <>
      <BoPowerSelectNew
        placeholder={'Select Service'}
        getLabel={({ name }: { name: string }) => name}
        queryDoc={GET_LBM_SERVICES}
        selectedId={selectedId}
        changeHandler={changeHandler}
        createOptionConfig={createOptionConfig}
      />
      {isModalOpen && (
        <LbmServicesModal entityId={selectedId} closeModal={closeModalHandler} />
      )}
    </>
  )
}

export default LbmServicePowerSelect
