import React, { useState } from 'react'

import Modal from './../../../../components/Modal'

import CmsSpecialtyCounts from './CmsSpecialtyCounts'

const CmsModalButton = ({ account }) => {
  const [showModal, setShowModal] = useState(false)

  const { groupPracticePacId } = account
  if (!groupPracticePacId) return null

  return (
    <>
      <button style={{ cursor: 'pointer', padding: 4, border: '1px solid black', borderRadius: 2 }} onClick={() => setShowModal(true)}>
        CMS Data
      </button>
      <Modal
        width={'90%'}
        title="CMS Specialty Counts"
        show={showModal}
        handleClose={() => setShowModal(false)}
      >
        <CmsSpecialtyCounts
          groupPracticePacId={groupPracticePacId}
        />
      </Modal>
    </>
  )
}

export default CmsModalButton
