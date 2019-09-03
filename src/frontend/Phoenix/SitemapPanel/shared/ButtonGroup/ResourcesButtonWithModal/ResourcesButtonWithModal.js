import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Modal from '../../../../../components/Modal'
import ModalContent from './ModalContent'

const ResourcesButton = ({
  nodeId,
  nodeType,
  handlers,
  selectedTeamNode,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
      >
        resources
      </button>
      <Modal
        handleClose={() => setIsOpen(false)}
        show={isOpen}
        title="Resources"
      >
        <ModalContent
          nodeId={nodeId}
          selectedTeamNode={selectedTeamNode}
          nodeType={nodeType}
          handlers={handlers}
        />
      </Modal>
    </>
  )
}

ResourcesButton.propTypes = {
  nodeId: PropTypes.string,
  nodeType: PropTypes.string,
  handlers: PropTypes.object,
  selectedTeamNode: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
}

export default ResourcesButton
