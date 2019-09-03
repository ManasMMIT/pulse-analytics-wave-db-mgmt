import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'

import { GET_STAGED_SITEMAP } from './../../../../../../api/queries'

import ModalContent from './ModalContent'

const ModalContentContainer = ({
  nodeId,
  nodeType,
  handlers,
  selectedTeamNode,
}) => {

  return (
    <Query query={GET_STAGED_SITEMAP}>
      {
        ({ data: { stagedSitemap }, loading, error }) => {
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
      }
    </Query>
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
