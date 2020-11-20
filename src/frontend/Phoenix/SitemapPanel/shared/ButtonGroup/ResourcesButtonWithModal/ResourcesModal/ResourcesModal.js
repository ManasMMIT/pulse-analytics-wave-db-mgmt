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
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
    modalStyle={{
      padding: 0,
      width: '80%',
      height: '90%',
      top: '45%',
      justifyContent: 'flex-start',
    }}
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
