import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import _ from 'lodash'
import util from 'util'

import { GET_OP_LOG } from '../../../api/queries'
import { formatDateTime } from '../../../utils/formatDate'

import Spinner from '../../shared/Spinner'

const OpLog = () => {
  const { loading, error, data } = useQuery(GET_OP_LOG, {
    pollInterval: 60000,
    notifyOnNetworkStatusChange: true,
  })

  if (loading) return (
    <div style={{ paddingTop: 24, color: 'white' }}>
      <span>
        Updating operations log 
      </span>
      <Spinner fill="white" />
    </div>
  )

  if (error) return <span style={{ color: 'red' }}>Error processing request</span>

  const { opLogs } = data

  const lastPushToProd = opLogs.find(({ operationName }) => operationName === 'PushSitemapToProd')

  return (
    <>
      {
        lastPushToProd && (
          <div style={{ color: 'white', paddingTop: 24 }}>
            Last Push to Prod: {formatDateTime(lastPushToProd.timestamp)}
          </div>
        )
      }
      
      <div style={{ color: 'white', paddingTop: 24 }}>Oplog Last Updated: {formatDateTime(new Date())}</div>
      
      <div style={{ color: 'white', paddingTop: 24, alignSelf: 'baseline' }}>
        Oplog Feed:
      </div>

      <ul style={{ color: 'white', flex: '1 0 0', overflowY: 'auto' }}>
        {
          opLogs.map(({ username, timestamp, operationName, operationVariables }) => (
            <li key={timestamp}>
              <span>{formatDateTime(timestamp)}</span><span>, </span>
              <span>{username}</span><span>, </span>
              <span title={util.inspect(operationVariables)}>
                {_.startCase(operationName)}
              </span>
            </li>
          ))
        }
      </ul>
    </>
  )
}

export default OpLog
