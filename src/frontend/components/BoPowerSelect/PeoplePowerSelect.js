import React, { useState } from 'react'

import PeopleModal from 'frontend/components/BusinessObjectModal/PeopleModal'
import { GET_PEOPLE } from 'frontend/api/queries'
import BoPowerSelectNew from './BoPowerSelectNew'

const PeoplePowerSelect = () => {
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
    createOptionText: 'Create Person',
  }

  return (
    <>
      <BoPowerSelectNew
        placeholder={'Select People'}
        getLabel={({ firstName, lastName }) => `${firstName} ${lastName}`}
        queryDoc={GET_PEOPLE}
        selectedId={selectedId}
        changeHandler={changeHandler}
        createOptionConfig={createOptionConfig}
      />
      {isModalOpen && (
        <PeopleModal entityId={selectedId} closeModal={closeModalHandler} />
      )}
    </>
  )
}

export default PeoplePowerSelect
