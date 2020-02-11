import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import _ from 'lodash'
import util from 'util'

import { GET_OP_LOG } from '../../../../api/queries'
import { formatDateTime } from '../../../../utils/formatDate'

import Spinner from '../../../shared/Spinner'

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

  const { opLogs } = data

  const pushToProdLogIdx = opLogs.findIndex(
    ({ operationName }) => operationName === 'PushSitemapToProd'
  )

  let pushToProdLog
  if (pushToProdLogIdx > -1) {
    pushToProdLog = opLogs.splice(pushToProdLogIdx, 1)[0]
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
                    operationName === 'UpdatePermissions' && (
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
