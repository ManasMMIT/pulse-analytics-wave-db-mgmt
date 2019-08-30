import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'

import { GET_SELECTED_TEAM } from './../../../../../../api/queries'

import ModalContent from './ModalContent'

const ModalContentContainer = ({
  nodeId,
  nodeType,
  handlers,
  selectedTeamNode,
}) => {

  // ! This query only fetches the original (old) team from Apollo Cache set from users.sitemaps in mongo
  // ! The edited team resources are stored in React local state
  return (
    <Query query={GET_SELECTED_TEAM}>
      {
        ({ data: { selectedTeam: { sitemap: { tools } } } }) => {
          return (
            <ModalContent
              nodeId={nodeId}
              nodeType={nodeType}
              handlers={handlers}
              selectedTeamNode={selectedTeamNode}
              teamTools={tools}
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
