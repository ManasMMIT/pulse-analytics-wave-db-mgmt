import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import _ from 'lodash'

import ConnectionsList from './ConnectionsList'
import ConnectionForm from './ConnectionForm'

import {
  GET_PAYER_ORGANIZATIONS,
  GET_JOIN_OBMS_AND_PAYERS,
  GET_BOOKS,
} from '../../../../../api/queries'

const ObmPayersWidget = ({ entity }) => {
  const [stagedConnections, stageConnections] = useState([])
  const [selectedConnectionId, selectConnectionId] = useState(null)

  const { data: payersData, loading: payersLoading } = useQuery(
    GET_PAYER_ORGANIZATIONS
  )
  const { data: booksData, loading: booksLoading } = useQuery(GET_BOOKS)
  const { data: connectionsData, loading: connectionsLoading } = useQuery(
    GET_JOIN_OBMS_AND_PAYERS,
    {
      variables: { obmId: entity._id },
    }
  )

  useEffect(() => {
    if (!payersLoading && !connectionsLoading && !booksLoading) {
      const connections = Object.values(connectionsData)[0]
      const { _id: firstConnectionId } = connections[0]

      selectConnectionId(firstConnectionId)
      stageConnections(connections)
    }
  }, [payersLoading, connectionsLoading, booksLoading])

  if (payersLoading || connectionsLoading || booksLoading) return 'Loading...'

  let allPayers = []
  let payerOrgById = {}
  if (!payersLoading) {
    allPayers = Object.values(payersData)[0]

    payerOrgById = _.mapValues(_.keyBy(allPayers, '_id'), 'organization')
  }

  return (
    <div style={{ flex: '1 0 auto', display: 'flex' }}>
      <ConnectionsList
        selectedConnectionId={selectedConnectionId}
        selectConnectionId={selectConnectionId}
        stagedConnections={stagedConnections}
        stageConnection={stageConnections}
        payerOrgById={payerOrgById}
      />

      <ConnectionForm
        connection={stagedConnections.find(
          ({ _id }) => _id === selectedConnectionId
        )}
        allPayers={allPayers}
      />
    </div>
  )
}

export default ObmPayersWidget
