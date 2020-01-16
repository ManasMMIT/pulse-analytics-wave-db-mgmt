import React, { useState } from 'react'
import _ from 'lodash'

import Connection from './Connection'
import CreateConnectionForm from './CreateConnectionForm'

import { SectionTitle } from '../styledAccountModalButtonComponents'

import {
  SectionHeader,
  ConnectionsWrapper,
  CreateConnectionButton,
} from './styledConnectionComponents'

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
      connections: connections.filter(obj => !_.isEqual(obj, connection)),
    })
  }

  return (
    <div>
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
              />
            )
          )
        }
      </ConnectionsWrapper>
    </div>
  )
}

export default ConnectionsSection
