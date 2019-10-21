import React, { useState } from 'react'
import PropTypes from 'prop-types'
import ResourcesModal from './ResourcesModal'

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

      <ResourcesModal
        handleClose={() => setIsOpen(false)}
        show={isOpen}
        nodeId={nodeId}
        nodeType={nodeType}
        handlers={handlers}
        selectedTeamNode={selectedTeamNode}
      />
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
