import React, { useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import _ from 'lodash'
import util from 'util'

import { GET_FULL_OP_LOGS } from '../../../../api/queries'
import { formatDateTime } from '../../../../utils/formatDate'

import Spinner from 'frontend/components/Spinner'

import {
  OpLogContainer,
  OpLogList,
  OpLogListItem,
  TimeUserContainer,
  TimeStamp,
  User,
  ActionContainer,
  Client,
  Action,
  Error,
} from './styledComponents'

const FullOpLog = () => {
  const [maxLineCount, setMaxLineCount] = useState(15)

  const [fetchOpLogs, { loading, data }] = useLazyQuery(GET_FULL_OP_LOGS, {
    fetchPolicy: 'network-only',
    onError: alert,
  })

  let opLogs = []
  if (data) opLogs = data.fullOpLogs

  return (
    <div style={{ padding: 24, height: '100%', overflow: 'auto' }}>
      <span style={{ marginRight: 12 }}>Pick number of log entries:</span>

      <input
        style={{ border: '1px solid black', marginRight: 12 }}
        type="number"
        value={String(maxLineCount)}
        onChange={(e) => setMaxLineCount(Number(e.currentTarget.value))}
      />

      {loading ? (
        <Spinner fill="blue" />
      ) : (
        <button
          style={{ border: '1px solid black' }}
          onClick={() => fetchOpLogs({ variables: { maxLineCount } })}
        >
          Submit
        </button>
      )}

      {_.isEmpty(opLogs) || (
        <OpLogContainer>
          <OpLogList>
            {opLogs.map(
              ({
                status,
                username,
                timestamp,
                operationName,
                operationVariables,
              }) => (
                <OpLogListItem key={timestamp} style={{ width: 500 }}>
                  <TimeUserContainer>
                    <TimeStamp>{formatDateTime(timestamp)}</TimeStamp>
                    <User>{username}</User>
                  </TimeUserContainer>
                  <ActionContainer>
                    {status === 'ERROR' && <Error>ERROR:&nbsp;</Error>}
                    {['UpdatePermissions', 'UpdateRoleSitemap'].includes(
                      operationName
                    ) && (
                        <Client>
                          [<span>{operationVariables.input.team.clientName}</span>
                        :<span>{operationVariables.input.team.teamName}</span>]
                        </Client>
                      )}
                    <Action title={util.inspect(operationVariables)}>
                      {_.startCase(operationName)}
                    </Action>
                  </ActionContainer>
                </OpLogListItem>
              )
            )}
          </OpLogList>
        </OpLogContainer>
      )}
    </div>
  )
}

export default FullOpLog
