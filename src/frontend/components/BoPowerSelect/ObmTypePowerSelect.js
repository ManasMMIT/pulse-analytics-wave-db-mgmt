import React, { useState } from 'react'

import ObmTypesModal from 'frontend/components/BusinessObjectModal/ObmTypesModal'
import { GET_OBM_TYPES } from 'frontend/api/queries'
import BoPowerSelectNew from './BoPowerSelectNew'

const ObmTypePowerSelect = () => {
  const [selectedId, selectId] = useState(null)
  const [isModalOpen, openModal] = useState(false)

  const changeHandler = ({ value }) => {
    selectId(value)
    openModal(true)
  }

  const closeModalHandler = () => {
    selectId(null)
    openModal(false)
  }

  const createOptionConfig = {
    clickHandler: () => openModal(true),
    createOptionText: 'Create OBM Type',
  }

  return (
    <>
      <BoPowerSelectNew
        placeholder={'Select OBM Type'}
        getLabel={({ name }) => name}
        queryDoc={GET_OBM_TYPES}
        selectedId={selectedId}
        changeHandler={changeHandler}
        createOptionConfig={createOptionConfig}
      />
      {isModalOpen && (
        <ObmTypesModal entityId={selectedId} closeModal={closeModalHandler} />
      )}
    </>
  )
}

export default ObmTypePowerSelect
