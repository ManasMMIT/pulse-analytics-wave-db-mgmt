import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import _ from 'lodash'

import Connection from './Connection'
import CreateConnectionForm from './CreateConnectionForm'

import {
  GET_ORGANIZATIONS,
} from '../../../../../api/queries'

const SectionHeader = styled.div({
  display: 'flex',
  fontSize: 16,
  fontWeight: 500,
  textDecoration: 'underline',
})

const ConnectionsWrapper = styled.div({
  maxHeight: 400,
  overflowY: 'scroll',
})

const ConnectionsSection = ({
  from,
  vbmConnectionDoc,
  refetchQueries,
  isEditModal,
  onActionHook,
}) => {
  const [showConnectionForm, setShowConnectionForm] = useState(false)

  refetchQueries.push({
    query: GET_ORGANIZATIONS,
    variables: { _id: from._id }
  })

  const { data, loading } = useQuery(GET_ORGANIZATIONS, {
    variables: { _id: from._id }
  })

  const connections = loading
    ? []
    : data.organizations.connections || []

  const orderedConnections = _.orderBy(
    connections,
    [
      'org.type',
      ({ org: { organization } }) => organization.toLowerCase(),
      'state',
    ]
  )

  return (
    <div>
      {
        isEditModal && 
          <SectionHeader>
            <span>Connections </span>
            <button onClick={() => setShowConnectionForm(!showConnectionForm)}>
              add
            </button>
          </SectionHeader>
      }
      {
        ( showConnectionForm &&
          <CreateConnectionForm
            from={from}
            postSubmitHook={() => setShowConnectionForm(false)}
            vbmConnectionDoc={vbmConnectionDoc}
            refetchQueries={refetchQueries}
            onActionHook={onActionHook}
          />
        )
      }
      <ConnectionsWrapper>
        { !loading &&
          orderedConnections.map((connection, idx) => (
              <Connection
                key={`${connection._id} ${ idx } ${ connection.org._id } ${ connection.state }`}
                from={from}
                to={connection}
                refetchQueries={refetchQueries}
                onActionHook={onActionHook}
              />
            )
          )
        }
      </ConnectionsWrapper>
    </div>
  )
}

export default ConnectionsSection
