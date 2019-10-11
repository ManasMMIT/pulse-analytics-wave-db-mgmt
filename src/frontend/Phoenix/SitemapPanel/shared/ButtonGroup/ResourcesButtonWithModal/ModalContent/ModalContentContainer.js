import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'

import { GET_STAGED_SITEMAP } from './../../../../../../api/queries'

import ModalContent from './ModalContent'

const ModalContentContainer = ({
  nodeId,
  nodeType,
  handlers,
  selectedTeamNode,
}) => {
  const { data, loading } = useQuery(GET_STAGED_SITEMAP)

  if (loading) return null

  const { stagedSitemap } = data

  return (
    <ModalContent
      nodeId={nodeId}
      nodeType={nodeType}
      handlers={handlers}
      selectedTeamNode={selectedTeamNode}
      teamTools={stagedSitemap.tools}
    />
  )
}

ModalContentContainer.propTypes = {
  nodeId: PropTypes.string,
  nodeType: PropTypes.string,
  handlers: PropTypes.object,
}

ModalContentContainer.defaultProps = {
  nodeId: null,
  nodeType: null,
  handlers: {},
}

export default ModalContentContainer
