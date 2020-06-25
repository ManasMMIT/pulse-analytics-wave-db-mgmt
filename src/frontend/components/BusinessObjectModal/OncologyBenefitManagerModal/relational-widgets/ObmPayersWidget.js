import React, { useEffect, useState } from 'react'
import { ObjectId } from 'mongodb'
import _ from 'lodash'
import Select from 'react-select'
import { useQuery, useMutation } from '@apollo/react-hooks'

import {
  GET_PAYER_ORGANIZATIONS,
  GET_OBM_AND_PAYER_CONNECTIONS,
} from '../../../../api/queries'

import { CONNECT_OBM_AND_PAYER } from '../../../../api/mutations'

const ObmPayersWidget = ({ entity }) => {
  const { data: payersData, loading: payersLoading } = useQuery(
    GET_PAYER_ORGANIZATIONS
  )

  const {
    data: connectionsData,
    loading: connectionsLoading,
  } = useQuery(GET_OBM_AND_PAYER_CONNECTIONS, {
    variables: { obmId: entity._id },
  })

  const [stagedConnections, stageConnections] = useState([])

  console.log(stagedConnections)

  const [save] = useMutation(CONNECT_OBM_AND_PAYER, {
    variables: {
      input: {
        obmId: entity._id,
        connections: stagedConnections,
      },
    },
    refetchQueries: [
      {
        query: GET_OBM_AND_PAYER_CONNECTIONS,
        variables: { obmId: entity._id },
      },
    ],
    onError: alert,
  })

  useEffect(() => {
    if (!payersLoading && !connectionsLoading) {
      // clean data of __typename and anything else
      const initialConnections = connectionsData.obmAndPayerConnections.map(
        ({ _id, payerId }) => ({ _id, payerId })
      )

      stageConnections(initialConnections)
    }
  }, [payersLoading, connectionsLoading])

  if (payersLoading || connectionsLoading) return 'Loading...'

  const payerDropdownOptions = payersData.payerOrganizations.map(
    ({ _id, organization }) => ({ value: _id, label: organization })
  )

  const clonedStagedConnections = _.cloneDeep(stagedConnections)

  return (
    <div style={{ padding: 24, width: '100%', height: '100%' }}>
      {stagedConnections.map((connection, idx) => {
        const { _id, payerId } = connection

        return (
          <div
            key={_id}
            style={{
              display: 'flex',
              border: '1px solid black',
              padding: 12,
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', width: 400, alignItems: 'center' }}>
              <label style={{ marginRight: 12 }}>Payer:</label>
              <Select
                styles={{ container: (base) => ({ ...base, flex: 1 }) }}
                options={payerDropdownOptions}
                value={payerDropdownOptions.find(
                  ({ value }) => value === payerId
                )}
                onChange={({ value }) => {
                  const newDoc = _.merge(clonedStagedConnections[idx], {
                    payerId: value,
                  })
                  clonedStagedConnections.splice(idx, 1, newDoc)
                  stageConnections(clonedStagedConnections)
                }}
              />
            </div>

            <div style={{ marginLeft: 'auto' }}>
              <button
                style={{
                  marginLeft: 12,
                  border: '1px solid black',
                  cursor: 'pointer',
                  padding: 4,
                }}
                onClick={() => {
                  clonedStagedConnections.splice(idx, 1)
                  stageConnections(clonedStagedConnections)
                }}
              >
                X
              </button>
            </div>
          </div>
        )
      })}

      <div>
        <button
          style={{
            border: '1px solid black',
            cursor: 'pointer',
            padding: 8,
            marginTop: 12,
          }}
          onClick={() => {
            const newConnection = { _id: ObjectId(), payerId: null }
            clonedStagedConnections.push(newConnection)
            stageConnections(clonedStagedConnections)
          }}
        >
          +
        </button>
      </div>

      <div>
        <button
          style={{
            border: '1px solid black',
            cursor: 'pointer',
            padding: 4,
            marginTop: 12,
          }}
          onClick={save}
        >
          Save
        </button>
      </div>
    </div>
  )
}

export default ObmPayersWidget
