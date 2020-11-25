import React, { useEffect, useState } from 'react'
import { ObjectId } from 'mongodb'
import _ from 'lodash'
import Select from 'react-select'
import { useQuery, useMutation } from '@apollo/react-hooks'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'

import {
  GET_PAYER_ORGANIZATIONS,
  GET_JOIN_OBMS_AND_PAYERS,
  GET_VIEW_OBM_PAYER_PARTNERSHIPS,
  GET_BOOKS,
} from '../../../../api/queries'

import { CONNECT_OBM_AND_PAYER } from '../../../../api/mutations'

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

const ObmPayersWidget = ({ entity }) => {
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
        query: GET_JOIN_OBMS_AND_PAYERS,
        variables: { obmId: entity._id },
      },
      {
        query: GET_VIEW_OBM_PAYER_PARTNERSHIPS,
      },
    ],
    onError: alert,
  })

  useEffect(() => {
    if (!payersLoading && !connectionsLoading) {
      // ! HOTFIX: make sure there are no connections in the cache for removed payers
      const payersById = _.keyBy(Object.values(payersData)[0], '_id')
      const validConnections = Object.values(connectionsData)[0].filter(
        (connection) => payersById[connection.payerId]
      )

      // remove `__typename` and `obmId` from staged connections data
      const initialConnections = validConnections.map(
        ({ __typename, obmId, ...rest }) => rest
      )

      stageConnections(initialConnections)
    }
  }, [payersLoading, connectionsLoading])

  if (payersLoading || connectionsLoading || booksLoading) return 'Loading...'

  const payerDropdownOptions = payersData.payerOrganizations.map(
    ({ _id, organization }) => ({
      value: _id,
      label: organization,
    })
  )

  const bookDropdownOptions = booksData.books.map(({ _id, name }) => ({
    value: _id,
    label: name,
  }))

  const clonedStagedConnections = _.cloneDeep(stagedConnections)

  return (
    <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
      <WidgetPanelHeader>
        <WidgetPanelTitle>OBM Payer Partnerships</WidgetPanelTitle>
      </WidgetPanelHeader>
      {stagedConnections.map((connection, idx) => {
        const { _id, payerId, bookIds, note = '' } = connection

        return (
          <RelationalRow key={_id}>
            <>
              <InputContainer>
                <InputLabel>Payer:</InputLabel>
                <div style={{ width: 250 }}>
                  <Select
                    styles={customSelectStyles}
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
              </InputContainer>
              <InputContainer>
                <InputLabel>Books:</InputLabel>
                <div style={{ width: 200 }}>
                  <Select
                    isMulti
                    styles={customSelectStyles}
                    options={bookDropdownOptions}
                    value={bookDropdownOptions.filter(({ value }) =>
                      (bookIds || []).includes(value)
                    )}
                    onChange={(options) => {
                      const newConnectionDoc = _.cloneDeep(
                        clonedStagedConnections[idx]
                      )
                      newConnectionDoc.bookIds = !_.isEmpty(options)
                        ? options.map(({ value }) => value)
                        : []

                      clonedStagedConnections.splice(idx, 1, newConnectionDoc)
                      stageConnections(clonedStagedConnections)
                    }}
                  />
                </div>
              </InputContainer>
              <InputContainer>
                <InputLabel>Note:</InputLabel>
                <RowInput
                  style={{ width: 200 }}
                  value={note}
                  onChange={(e) => {
                    const newDoc = _.merge(clonedStagedConnections[idx], {
                      note: e.target.value,
                    })
                    clonedStagedConnections.splice(idx, 1, newDoc)
                    stageConnections(clonedStagedConnections)
                  }}
                />
              </InputContainer>
            </>
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
              const newConnection = { _id: ObjectId(), payerId: null }
              clonedStagedConnections.push(newConnection)
              stageConnections(clonedStagedConnections)
            }}
          >
            + Add Payer
          </Button>
        </div>

        <SaveContainer>
          <SaveWarningBox>
            IMPORTANT: You must click this save button to persist payer changes.
          </SaveWarningBox>
          <Button color={Color.GREEN} onClick={save}>
            Save
          </Button>
        </SaveContainer>
      </FixedControlRow>
    </div>
  )
}

export default ObmPayersWidget
