import React, { useEffect, useState } from 'react'
import { ObjectId } from 'mongodb'
import _ from 'lodash'
import Select from 'react-select'
import { useQuery, useMutation } from '@apollo/react-hooks'

import {
  GET_PEOPLE,
  GET_OBM_AND_PERSON_CONNECTIONS,
  GET_INFLUENCER_TEMPLATE_OBMS,
} from '../../../../api/queries'

import { CONNECT_OBM_AND_PERSON } from '../../../../api/mutations'

const ObmInfluencersWidget = ({ entity }) => {
  const { data: peopleData, loading: peopleLoading } = useQuery(GET_PEOPLE)

  const { data: connectionsData, loading: connectionsLoading } = useQuery(
    GET_OBM_AND_PERSON_CONNECTIONS,
    {
      variables: { obmId: entity._id },
    }
  )

  const [stagedConnections, stageConnections] = useState([])

  console.log(stagedConnections)

  const [save] = useMutation(CONNECT_OBM_AND_PERSON, {
    variables: {
      input: stagedConnections,
    },
    refetchQueries: [
      {
        query: GET_OBM_AND_PERSON_CONNECTIONS,
        variables: { obmId: entity._id },
      },
      {
        query: GET_INFLUENCER_TEMPLATE_OBMS,
      },
    ],
    onError: alert,
  })

  useEffect(() => {
    if (!peopleLoading && !connectionsLoading) {
      // clean data of __typename and anything else
      const initialConnections = connectionsData.obmAndPersonConnections.map(
        ({ _id, personId, obmId, position }) => ({
          _id,
          personId,
          obmId,
          position,
        })
      )

      stageConnections(initialConnections)
    }
  }, [peopleLoading, connectionsLoading])

  if (peopleLoading || connectionsLoading) return 'Loading...'

  const peopleDropdownOptions = peopleData.people.map(({ _id, firstName, lastName }) => ({
    value: _id,
    label: `${firstName} ${lastName}`,
  }))

  const clonedStagedConnections = _.cloneDeep(stagedConnections)

  return (
    <div style={{ padding: 24, width: '100%', height: '100%' }}>
      {stagedConnections.map((connection, idx) => {
        const { _id, personId, position } = connection

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
              <label style={{ marginRight: 12 }}>OBM Influencer:</label>
              <Select
                styles={{ container: (base) => ({ ...base, flex: 1 }) }}
                options={peopleDropdownOptions}
                value={peopleDropdownOptions.find(({ value }) => value === personId)}
                onChange={({ value }) => {
                  const newDoc = _.merge(clonedStagedConnections[idx], {
                    personId: value,
                  })
                  clonedStagedConnections.splice(idx, 1, newDoc)
                  stageConnections(clonedStagedConnections)
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 12 }}>
              <label style={{ marginRight: 12 }}>Position:</label>

              <input
                value={position}
                style={{
                  marginLeft: 12,
                  border: '1px solid black',
                  padding: 6,
                  width: 300,
                }}
                onChange={(e) => {
                  const newDoc = _.merge(clonedStagedConnections[idx], {
                    position: e.currentTarget.value,
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
            const newConnection = {
              _id: ObjectId(),
              personId: null,
              position: null,
              obmId: entity._id,
            }
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

export default ObmInfluencersWidget
