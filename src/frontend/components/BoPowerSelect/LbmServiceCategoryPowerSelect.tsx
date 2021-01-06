import React, { useState } from 'react'

import LbmServicesCategoriesModal from 'frontend/components/BusinessObjectModal/LbmServicesCategoriesModal'
import { GET_LBM_SERVICES_CATEGORIES } from 'frontend/api/queries'
import BoPowerSelectNew from './BoPowerSelectNew'

const LbmServiceCategoryPowerSelect = () => {
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
    createOptionText: 'Create Service Category',
  }

  return (
    <>
      <BoPowerSelectNew
        placeholder={'Select Service Category'}
        getLabel={({ name }: { name: string }) => name}
        queryDoc={GET_LBM_SERVICES_CATEGORIES}
        selectedId={selectedId}
        changeHandler={changeHandler}
        createOptionConfig={createOptionConfig}
      />
      {isModalOpen && (
        <LbmServicesCategoriesModal entityId={selectedId} closeModal={closeModalHandler} />
      )}
    </>
  )
}

export default LbmServiceCategoryPowerSelect
