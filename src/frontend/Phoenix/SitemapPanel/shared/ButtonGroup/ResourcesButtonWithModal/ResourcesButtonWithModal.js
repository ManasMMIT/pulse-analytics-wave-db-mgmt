import React, { useState } from 'react'
import PropTypes from 'prop-types'
import ResourcesModal from './ResourcesModal'

const ResourcesButtonWithModal = ({
  nodeId,
  nodeType,
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

      <ResourcesModal
        handleClose={() => setIsOpen(false)}
        show={isOpen}
        nodeId={nodeId}
        nodeType={nodeType}
        selectedTeamNode={selectedTeamNode}
      />
    </>
  )
}

ResourcesButtonWithModal.propTypes = {
  nodeId: PropTypes.string,
  nodeType: PropTypes.string,
  selectedTeamNode: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
}

export default ResourcesButtonWithModal
