import React, { useEffect, useState } from 'react'
import { ObjectId } from 'mongodb'
import _ from 'lodash'
import Select from 'react-select'
import { useQuery, useMutation } from '@apollo/react-hooks'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'

import {
  GET_PEOPLE,
  GET_JOIN_OBMS_AND_PEOPLE,
  GET_VIEW_OBM_INFLUENCERS,
} from 'frontend/api/queries'

import { CONNECT_OBM_AND_PERSON } from 'frontend/api/mutations'

import useObmPersonConnections from 'frontend/Orion/Organizations/Obm/useObmPersonConnections'

import { customSelectStyles } from 'frontend/components/customSelectStyles'
import Button from 'frontend/components/Button'
import Color from 'frontend/utils/color'

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

const MANAGEMENT_TYPES = ['Business', 'Clinical']

const ObmInfluencersWidget = ({ entity }) => {
  const { data: peopleData, loading: peopleLoading } = useQuery(GET_PEOPLE)

  const {
    data: connectionsData,
    loading: connectionsLoading,
  } = useObmPersonConnections({
    obmId: entity._id,
  })

  const [stagedConnections, stageConnections] = useState([])

  console.log(stagedConnections)

  const [save] = useMutation(CONNECT_OBM_AND_PERSON, {
    variables: {
      input: stagedConnections,
    },
    refetchQueries: [
      {
        query: GET_JOIN_OBMS_AND_PEOPLE,
      },
      {
        query: GET_VIEW_OBM_INFLUENCERS,
      },
    ],
    onError: alert,
  })

  useEffect(() => {
    if (!peopleLoading && !connectionsLoading) {
      // clean data of __typename and anything else
      const initialConnections = connectionsData.map(
        ({ _id, personId, obmId, position, managementTypes }) => ({
          _id,
          personId,
          obmId,
          position,
          managementTypes: managementTypes || [],
        })
      )

      stageConnections(initialConnections)
    }
  }, [peopleLoading, connectionsLoading])

  if (peopleLoading || connectionsLoading) return 'Loading...'

  const peopleDropdownOptions = peopleData.people.map(
    ({ _id, firstName, lastName }) => ({
      value: _id,
      label: `${firstName} ${lastName}`,
    })
  )

  const clonedStagedConnections = _.cloneDeep(stagedConnections)

  return (
    <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
      <WidgetPanelHeader>
        <WidgetPanelTitle>OBM Influencers</WidgetPanelTitle>
      </WidgetPanelHeader>
      {stagedConnections.map((connection, idx) => {
        const { _id, personId, position, managementTypes } = connection

        return (
          <RelationalRow key={_id}>
            <InputContainer>
              <InputLabel>OBM Influencer:</InputLabel>
              <div style={{ width: 300 }}>
                <Select
                  styles={customSelectStyles}
                  options={peopleDropdownOptions}
                  value={peopleDropdownOptions.find(
                    ({ value }) => value === personId
                  )}
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

            <div
              style={{ display: 'flex', alignItems: 'center', marginLeft: 12 }}
            >
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

            <div
              style={{ display: 'flex', alignItems: 'center', marginLeft: 12 }}
            >
              <InputLabel>Management Types:</InputLabel>
              <div style={{ width: 300 }}>
                <Select
                  isMulti
                  styles={customSelectStyles}
                  options={MANAGEMENT_TYPES.map((type) => ({
                    label: type,
                    value: type,
                  }))}
                  value={managementTypes.map((type) => ({
                    label: type,
                    value: type,
                  }))}
                  onChange={(optionsArr) => {
                    let clonedConnection = _.cloneDeep(
                      clonedStagedConnections[idx]
                    )

                    if (_.isEmpty(optionsArr)) {
                      clonedConnection.managementTypes = []
                    } else {
                      clonedConnection.managementTypes = optionsArr.map(
                        ({ value }) => value
                      )
                    }

                    clonedConnection.managementTypes.sort((a, b) =>
                      a.localeCompare(b)
                    )

                    clonedStagedConnections.splice(idx, 1, clonedConnection)
                    stageConnections(clonedStagedConnections)
                  }}
                />
              </div>
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
                managementTypes: [],
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
            IMPORTANT: You must click this save button to persist influencer
            changes.
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
