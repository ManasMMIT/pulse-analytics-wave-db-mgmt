import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Modal from '../../../../../components/Modal'
import ModalContent from './ModalContent'

const ResourcesButton = ({
  nodeId,
  nodeType,
  resources,
  handlers,
  teamEntityNodes,
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
          nodeType={nodeType}
          resources={resources}
          handlers={handlers}
          teamEntityNodes={teamEntityNodes}
        />
      </Modal>
    </>
  )
}

ResourcesButton.propTypes = {
  nodeId: PropTypes.string,
  nodeType: PropTypes.string,
  resources: PropTypes.object,
  handlers: PropTypes.object,
  teamEntityNodes: PropTypes.object,
}

export default ResourcesButton
