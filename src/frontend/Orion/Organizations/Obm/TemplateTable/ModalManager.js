import React, { useEffect, useState } from 'react'

const ModalManager = ({ modalColMap, modalCell }) => {
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    if (modalCell) setIsOpen(true)
  }, [modalCell])

  if (!modalCell || !isOpen) return null

  const cellModalInfo = modalColMap[modalCell.column.id]

  if (!cellModalInfo) return null

  const { Modal, idKey } = cellModalInfo

  const entityId = modalCell.row.original[idKey]

  if (!entityId) return null

  return <Modal entityId={entityId} closeModal={() => setIsOpen(false)} />
}

export default ModalManager
