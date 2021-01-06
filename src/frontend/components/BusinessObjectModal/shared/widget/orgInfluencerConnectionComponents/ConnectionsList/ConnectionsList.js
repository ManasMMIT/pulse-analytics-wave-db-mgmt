import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import styled from '@emotion/styled'

import SectionTitle from 'frontend/components/SectionTitle'
import List from 'frontend/components/List'

import ConnectionsSublist from './ConnectionsSublist'

const ConnectionsListWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '50%',
})

const ConnectionsList = ({
  widgetTitle,
  changeConnection,
  selectedConnection,
  connectionsData,
  createButton,
  ConnectionListItem,
  isNewConnectionBeingCreated,
  anyUnsavedChanges,
}) => {
  const clickHandler = (value) => {
    if (anyUnsavedChanges || isNewConnectionBeingCreated) {
      // Disable selection whenever edits are in progress
      alert(
        "You have unsaved changes! First save or cancel the connection you're on."
      )
    } else {
      changeConnection(value)
    }
  }

  const groupedConnectionsByStatus = _.sortBy(
    Object.entries(_.groupBy(connectionsData, 'status')),
    ([status]) => status
  )

  return (
    <ConnectionsListWrapper>
      <SectionTitle title={widgetTitle}>{createButton}</SectionTitle>
      <List>
        {isNewConnectionBeingCreated && (
          <ConnectionListItem value={selectedConnection} isActive />
        )}

        {groupedConnectionsByStatus.map(([status, data]) => (
          <ConnectionsSublist
            key={status}
            status={status}
            data={data}
            ConnectionListItem={ConnectionListItem}
            selectedConnection={selectedConnection}
            clickHandler={clickHandler}
          />
        ))}
      </List>
    </ConnectionsListWrapper>
  )
}

ConnectionsList.propTypes = {
  widgetTitle: PropTypes.func.isRequired,
  createButton: PropTypes.node,
  changeConnection: PropTypes.func.isRequired,
  connectionsData: PropTypes.array.isRequired,
  selectedConnection: PropTypes.object.isRequired,
  isNewConnectionBeingCreated: PropTypes.bool.isRequired,
  setWhetherNewOrgBeingCreated: PropTypes.func.isRequired,
}

ConnectionsList.defaultProps = {
  createButton: () => null,
}

export default ConnectionsList
