import React from 'react'

import Modal from '../../../../../../components/Modal'
import ModalContent from './ModalContent'

const ResourcesModal = ({
  handleClose,
  show,
  nodeId,
  nodeType,
  handlers,
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
      handlers={handlers}
      closeModal={handleClose}
    />
  </Modal>
)

export default ResourcesModal
