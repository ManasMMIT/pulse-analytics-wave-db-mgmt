import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import _ from 'lodash'
import styled from '@emotion/styled'

import useObmAndPayerConnections from 'frontend/hooks/useObmPayerConnections'
import manualBoModalLockOverlay from 'frontend/components/BusinessObjectModal/shared/widget/manualBoModalLockOverlay'

import ConnectionPanel from './ConnectionPanel'
import ConnectionsList from './ConnectionsList'

import { GET_PAYER_ORGANIZATIONS, GET_BOOKS } from '../../../../../api/queries'

const WidgetContainer = styled.div({
  display: 'flex',
  width: '100%',
})

const WIDGET_TITLE = 'Payer Connections'

const ObmPayersWidget = ({ entity }) => {
  const [selectedConnectionId, selectConnectionId] = useState(null)
  const [
    isNewConnectionBeingCreated,
    setWhetherNewConnectionBeingCreated,
  ] = useState(false)
  const [anyUnsavedChanges, setWhetherUnsavedChanges] = useState(false)

  const { data: payersData, loading: payersLoading } = useQuery(
    GET_PAYER_ORGANIZATIONS
  )
  const { data: booksData, loading: booksLoading } = useQuery(GET_BOOKS)
  const {
    data: connections,
    loading: connectionsLoading,
  } = useObmAndPayerConnections({ obmId: entity._id })

  useEffect(() => {
    if (!payersLoading && !booksLoading && !connectionsLoading) {
      const { _id: firstConnectionId } = connections[0] || {}
      selectConnectionId(firstConnectionId)
    }
  }, [payersLoading, connectionsLoading, booksLoading])

  if (payersLoading || connectionsLoading || booksLoading) return 'Loading...'

  const createConnectionHandler = () => {
    if (anyUnsavedChanges) {
      alert(
        "You have unsaved changes! Please save or cancel the connection you're on."
      )
    } else {
      setWhetherNewConnectionBeingCreated(true)
    }
  }

  let allPayers = []
  if (!payersLoading) allPayers = Object.values(payersData)[0]
  const payerOrgById = _.mapValues(_.keyBy(allPayers, '_id'), 'organization')

  let allBooks = []
  if (!booksLoading) allBooks = Object.values(booksData)[0]

  manualBoModalLockOverlay(anyUnsavedChanges)

  return (
    <WidgetContainer>
      <ConnectionsList
        connections={connections}
        widgetTitle={WIDGET_TITLE}
        createConnectionHandler={createConnectionHandler}
        selectedConnectionId={selectedConnectionId}
        selectConnectionId={selectConnectionId}
        isNewConnectionBeingCreated={isNewConnectionBeingCreated}
        anyUnsavedChanges={anyUnsavedChanges}
        payerOrgById={payerOrgById}
      />

      <ConnectionPanel
        connection={connections.find(({ _id }) => _id === selectedConnectionId)}
        connections={connections}
        payerOrgById={payerOrgById}
        isNewConnectionBeingCreated={isNewConnectionBeingCreated}
        obmId={entity._id}
        setWhetherNewConnectionBeingCreated={
          setWhetherNewConnectionBeingCreated
        }
        setWhetherUnsavedChanges={setWhetherUnsavedChanges}
        selectConnectionId={selectConnectionId}
        allBooks={allBooks}
      />
    </WidgetContainer>
  )
}

export default ObmPayersWidget
