import React, { useState } from 'react'

import LbmModal from 'frontend/components/BusinessObjectModal/LbmModal'
import { GET_LBM_ORGANIZATIONS } from 'frontend/api/queries'
import BoPowerSelectNew from './BoPowerSelectNew'

const LbmPowerSelect = () => {
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
    createOptionText: 'Create LBM',
  }

  return (
    <>
      <BoPowerSelectNew
        placeholder={'Select LBM'}
        getLabel={({ organization }: { organization: string }) => organization}
        queryDoc={GET_LBM_ORGANIZATIONS}
        selectedId={selectedId}
        changeHandler={changeHandler}
        createOptionConfig={createOptionConfig}
      />
      {isModalOpen && (
        <LbmModal entityId={selectedId} closeModal={closeModalHandler} />
      )}
    </>
  )
}

export default LbmPowerSelect
