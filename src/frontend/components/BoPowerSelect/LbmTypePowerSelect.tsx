import React, { useState } from 'react'

import LbmTypesModal from 'frontend/components/BusinessObjectModal/LbmTypesModal'
import { GET_LBM_TYPES } from 'frontend/api/queries'
import BoPowerSelectNew from './BoPowerSelectNew'

const LbmTypePowerSelect = () => {
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
    createOptionText: 'Create LBM Type',
  }

  return (
    <>
      <BoPowerSelectNew
        placeholder={'Select LBM Type'}
        getLabel={({ name }: { name: string }) => name}
        queryDoc={GET_LBM_TYPES}
        selectedId={selectedId}
        changeHandler={changeHandler}
        createOptionConfig={createOptionConfig}
      />
      {isModalOpen && (
        <LbmTypesModal entityId={selectedId} closeModal={closeModalHandler} />
      )}
    </>
  )
}

export default LbmTypePowerSelect
