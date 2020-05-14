import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import _ from 'lodash'
import util from 'util'

import { GET_OP_LOG } from '../../../../api/queries'
import { formatDateTime } from '../../../../utils/formatDate'

import Spinner from 'frontend/components/Spinner'

import {
  OpLogTitle,
  OpLogRefreshLabel,
  OpLogLastUpdatedContainer,
  OpLogLastUpdatedTitle,
  OpLogContainer,
  OpLogList,
  OpLogListItem,
  TimeUserContainer,
  TimeStamp,
  User,
  ActionContainer,
  Client,
  Action,
  OpLogLoadingContainer,
  OpLogLoadingMessage,
} from './styledComponents'

const OpLog = () => {
  const { loading, error, data } = useQuery(GET_OP_LOG, {
    pollInterval: 60000,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  })

  if (loading) return (
    <OpLogLoadingContainer >
      <Spinner fill="white" />
      <OpLogLoadingMessage>
        Refreshing Change Log, Stand By
      </OpLogLoadingMessage>
    </OpLogLoadingContainer>
  )

  if (error) return <span style={{ color: 'red' }}>Error processing request</span>

  let { opLogs } = data

  let pushToProdLog
  if (!_.isEmpty(opLogs)) {
    if (opLogs[opLogs.length - 1].operationName === 'PushSitemapToProd') {
      pushToProdLog = opLogs[opLogs.length - 1]
      opLogs = opLogs.slice(0, opLogs.length - 1)
    }
  }

  return (
    <>
      {
        pushToProdLog && (
          <OpLogLastUpdatedContainer>
            <OpLogLastUpdatedTitle>Permissions Last Deployed:</OpLogLastUpdatedTitle>
            <div>{formatDateTime(pushToProdLog.timestamp)} by <User>{pushToProdLog.username}</User></div>
          </OpLogLastUpdatedContainer>
        )
      }

      <OpLogContainer>
        <OpLogTitle>
          Changes Staged + Log:
          <OpLogRefreshLabel>Refreshed every 1 min: {formatDateTime(new Date())}</OpLogRefreshLabel>
        </OpLogTitle>
        <OpLogList>
          {
            opLogs.map(({ username, timestamp, operationName, operationVariables }) => (
              <OpLogListItem key={timestamp}>
                <TimeUserContainer>
                  <TimeStamp>{formatDateTime(timestamp)}</TimeStamp>
                  <User>{username}</User>
                </TimeUserContainer>
                <ActionContainer>
                  {
                    ['UpdatePermissions', 'UpdateRoleSitemap'].includes(operationName) && (
                      <Client>
                        [
                          <span>{operationVariables.input.team.clientName}</span>
                          : 
                          <span>{operationVariables.input.team.teamName}</span>
                        ]
                      </Client>
                    )
                  }
                  <Action title={util.inspect(operationVariables)}>
                    {_.startCase(operationName)}
                  </Action>
                </ActionContainer>
              </OpLogListItem>
            ))
          }
        </OpLogList>
      </OpLogContainer>
    </>
  )
}

export default OpLog
