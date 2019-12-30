import React from 'react'

import Modal from '../../../../../../components/Modal'
import ModalContent from './ModalContent'

const ResourcesModal = ({
  handleClose,
  show,
  nodeId,
  nodeType,
  selectedTeamNode,
}) => (
  <Modal
    handleClose={handleClose}
    show={show}
    disableHeader
  >
    <ModalContent
      nodeId={nodeId}
      selectedTeamNode={selectedTeamNode}
      nodeType={nodeType}
      closeModal={handleClose}
    />
  </Modal>
)

export default ResourcesModal
