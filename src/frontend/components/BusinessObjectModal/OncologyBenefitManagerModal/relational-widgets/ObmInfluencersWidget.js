import React, { useEffect, useState } from 'react'
import { ObjectId } from 'mongodb'
import _ from 'lodash'
import Select from 'react-select'
import { useQuery, useMutation } from '@apollo/react-hooks'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'

import {
  GET_PEOPLE,
  GET_OBM_AND_PERSON_CONNECTIONS,
  GET_INFLUENCER_TEMPLATE_OBMS,
} from '../../../../api/queries'

import { CONNECT_OBM_AND_PERSON } from '../../../../api/mutations'

import { customSelectStyles } from '../../../../components/customSelectStyles'
import Button from '../../../../components/Button'
import Color from '../../../../utils/color'

import {
  RelationalRow,
  InputContainer,
  InputLabel,
  RowInput,
  FixedControlRow,
  SaveWarningBox,
  SaveContainer,
  WidgetPanelHeader,
  WidgetPanelTitle,
  DeleteButton,
} from './styledComponents'

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
      // ! HOTFIX: make sure there are no connections in the cache for removed people
      const peopleById = _.keyBy(peopleData.people, '_id')
      const validConnections = connectionsData.obmAndPersonConnections.filter(
        (connection) => peopleById[connection.personId]
      )

      // clean data of __typename and anything else
      const initialConnections = validConnections.map(({ _id, personId, obmId, position }) => ({
        _id,
        personId,
        obmId,
        position,
      }))

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
    <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
      <WidgetPanelHeader>
        <WidgetPanelTitle>OBM Influencers</WidgetPanelTitle>
      </WidgetPanelHeader>
      {stagedConnections.map((connection, idx) => {
        const { _id, personId, position } = connection

        return (
          <RelationalRow key={_id}>
            <InputContainer>
              <InputLabel>OBM Influencer:</InputLabel>
              <div style={{ width: 300 }}>
                <Select
                  styles={customSelectStyles}
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
            </InputContainer>

            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 12 }}>
              <InputLabel>Position:</InputLabel>

              <RowInput
                value={position}
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
              <DeleteButton
                onClick={() => {
                  clonedStagedConnections.splice(idx, 1)
                  stageConnections(clonedStagedConnections)
                }}
              >
                <FontAwesomeIcon size="lg" icon={faTrashAlt} />
              </DeleteButton>
            </div>
          </RelationalRow>
        )
      })}

      <FixedControlRow>
        <div>
          <Button
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
            + Add Influencer
          </Button>
        </div>

        <SaveContainer>
          <SaveWarningBox>
            IMPORTANT: You must click this save button to persist influencer changes.
          </SaveWarningBox>
          <Button onClick={save} color={Color.GREEN}>
            Save Influencer Changes
          </Button>
        </SaveContainer>
      </FixedControlRow>
    </div>
  )
}

export default ObmInfluencersWidget
