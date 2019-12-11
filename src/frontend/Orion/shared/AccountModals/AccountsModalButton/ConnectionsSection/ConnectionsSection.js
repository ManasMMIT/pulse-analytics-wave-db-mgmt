import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import _ from 'lodash'

import Connection from './Connection'
import CreateConnectionForm from './CreateConnectionForm'

import {
  GET_PAYER_ORGANIZATIONS,
  GET_PATHWAYS_ORGANIZATIONS,
  GET_PROVIDER_ORGANIZATIONS,
  GET_APM_ORGANIZATIONS,
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

const TYPE_MAP = {
  'Payer': GET_PAYER_ORGANIZATIONS,
  'Pathways': GET_PATHWAYS_ORGANIZATIONS,
  'Provider': GET_PROVIDER_ORGANIZATIONS,
  'Alternative Payment Model': GET_APM_ORGANIZATIONS,
}

const ConnectionsSection = ({
  from,
  vbmConnectionDoc,
  refetchQueries,
  isEditModal,
  onActionHook,
}) => {
  const [showConnectionForm, setShowConnectionForm] = useState(false)

  const { data, loading } = useQuery(TYPE_MAP[from.type])

  let connections = []
  if (!loading) {
    const masterListFromAccount = Object.values(data)[0].find(account => account._id === from._id)

    connections = masterListFromAccount.connections
  }

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
