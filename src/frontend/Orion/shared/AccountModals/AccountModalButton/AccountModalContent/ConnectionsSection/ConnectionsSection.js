import React, { useState } from 'react'
import _ from 'lodash'

import Connection from './Connection'
import CreateConnectionForm from './CreateConnectionForm'

import { SectionTitle } from '../../styledAccountModalButtonComponents'

import {
  SectionHeader,
  ConnectionsWrapper,
  CreateConnectionButton,
} from './styledConnectionComponents'

const wrapperStyle = {
  padding: '0 24px',
  minWidth: 400,
  minHeight: 300,
}

const ConnectionsSection = ({
  from,
  safelySetFormState,
}) => {
  const [showConnectionForm, setShowConnectionForm] = useState(false)

  const { connections } = from

  let orderedConnections = []
  if (!_.isEmpty(connections)) {
    orderedConnections = _.orderBy(
      connections,
      [
        'org.type',
        ({ org: { organization } }) => organization.toLowerCase(),
        'state',
      ]
    )
  }

  const addConnection = connection => {
    connections.push(connection)

    safelySetFormState({
      connections, 
    })

    setShowConnectionForm(false)
  }

  const removeConnection = connection => {
    safelySetFormState({
      connections: connections.filter(obj => !_.isEqual(obj, connection)), // ! HACK: or feature? it removes duped staged (non-id'ed) connections if there were any 
    })
  }

  // use this setState func after the alerts, if any, finish loading within any given connection placard
  const hydrateConnectionAlert = (connection, alert) => {
    const clonedConnections = _.cloneDeep(connections)

    const targetConnection = clonedConnections.find(obj => _.isEqual(obj, connection))
    
    targetConnection.alert = alert

    safelySetFormState({
      connections: clonedConnections,
    })
  }

  return (
    <div style={wrapperStyle}>
      <SectionHeader>
        <SectionTitle>Connections</SectionTitle>
        <CreateConnectionButton onClick={() => setShowConnectionForm(!showConnectionForm)}>
          + Connection
        </CreateConnectionButton>
      </SectionHeader>
      {
        ( showConnectionForm &&
          <CreateConnectionForm
            from={from}
            addConnection={addConnection}
          />
        )
      }
      <ConnectionsWrapper>
        { orderedConnections.map((connection, idx) => (
              <Connection
                key={`${connection._id} ${ idx } ${ connection.org._id } ${ connection.state }`}
                from={from}
                data={connection}
                removeConnection={removeConnection}
                hydrateConnectionAlert={hydrateConnectionAlert}
              />
            )
          )
        }
      </ConnectionsWrapper>
    </div>
  )
}

export default ConnectionsSection
