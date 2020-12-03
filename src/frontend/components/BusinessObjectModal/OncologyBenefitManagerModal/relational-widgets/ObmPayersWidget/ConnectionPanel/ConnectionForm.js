import React from 'react'
import _ from 'lodash'
import Select from 'react-select'

import Input from 'frontend/components/Input'
import DropdownMenu from 'frontend/components/DropdownMenu'
import MenuItem from 'frontend/components/Menu/MenuItem'
import MenuGroup from 'frontend/components/Menu/MenuGroup'
import Button from 'frontend/components/Button'

import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'

import stateAbbreviations from 'frontend/Orion/shared/AccountModals/AccountModalButton/AccountModalContent/ConnectionsSection/utils/state-abbreviations'

import {
  FieldContainer,
  FormLabel,
  FieldWrapper,
  FormWrapper,
} from './styledComponents'

const stateDropdownOptions = stateAbbreviations.map((state) => ({
  label: state,
  value: state,
}))

const ConnectionForm = ({
  stagedConnection,
  stageConnection,
  payerOrgById,
  setWhetherUnsavedChanges,
  isNewConnectionBeingCreated,
  allBooks,
}) => {
  const { payerId, note = '', books = [] } = stagedConnection

  const updateStagedConnection = (newData) => {
    stageConnection(newData)
    setWhetherUnsavedChanges(true)
  }

  const selectPayerId = (newPayerId) => {
    updateStagedConnection(
      _.merge({}, stagedConnection, { payerId: newPayerId })
    )
  }

  const updateNote = ({ value }) => {
    updateStagedConnection(_.merge({}, stagedConnection, { note: value }))
  }

  const addNewBook = (newBook) => {
    updateStagedConnection(
      _.merge({}, stagedConnection, { books: [...books, newBook] })
    )
  }

  const removeBook = (bookId) => {
    const newConnection = _.cloneDeep(stagedConnection)
    newConnection.books = books.filter(
      ({ _id: localBookId }) => localBookId !== bookId
    )
    updateStagedConnection(newConnection)
  }

  const handleBookUpdate = (bookId, key, value) => {
    const newConnection = _.cloneDeep(stagedConnection)

    const targetBookIdx = newConnection.books.findIndex(
      ({ _id: localBookId }) => localBookId === bookId
    )

    const bookObjToEdit = newConnection.books[targetBookIdx]

    bookObjToEdit[key] = value

    updateStagedConnection(newConnection)
  }

  const payerDropdownOptions = _.map(
    payerOrgById,
    (organization, localPayerId) => ({
      value: localPayerId,
      label: organization,
    })
  )

  const arbitraryThreeBooks = _.sortBy(
    allBooks.filter(({ name }) =>
      ['Managed Medicaid', 'Medicare', 'Commercial'].includes(name)
    ),
    ({ name }) => name.toLowerCase()
  )

  const sortedBooks = _.sortBy(books, ({ name }) => name.toLowerCase())

  const isNationalOptions = [
    { label: 'National', value: true },
    { label: 'States', value: false },
  ]

  return (
    <FormWrapper>
      <FieldContainer>
        <FieldWrapper>
          <FormLabel>Connected Payer Organization</FormLabel>
          <Select
            isDisabled={!isNewConnectionBeingCreated}
            options={payerDropdownOptions}
            value={
              payerId
                ? payerDropdownOptions.find(({ value }) => value === payerId)
                : null
            }
            onChange={({ value }) => selectPayerId(value)}
          />
        </FieldWrapper>
        <FieldWrapper>
          <FormLabel>Note</FormLabel>
          <Input type="text" value={note} name="note" onChange={updateNote} />
        </FieldWrapper>
      </FieldContainer>

      <FieldContainer>
        <FieldWrapper>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h2>Books:</h2>

            <DropdownMenu style={{ right: 20 }}>
              <MenuGroup menuGroupLabel={'Add New Book:'}>
                {arbitraryThreeBooks.reduce((acc, { _id, name }) => {
                  if (
                    !books.find(
                      ({ _id: existingBookId }) => existingBookId === _id
                    )
                  ) {
                    acc.push(
                      <MenuItem
                        key={_id}
                        label={name}
                        value={_id}
                        clickHandler={() =>
                          addNewBook({
                            _id,
                            name,
                            isNational: true,
                            states: [],
                          })
                        }
                      />
                    )
                  }

                  return acc
                }, [])}
              </MenuGroup>
            </DropdownMenu>
          </div>
        </FieldWrapper>
      </FieldContainer>

      {sortedBooks.map(({ _id, name, isNational, states }) => {
        return (
          <FieldContainer key={_id}>
            <FieldWrapper>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                }}
              >
                <h3>{name}</h3>

                <Button
                  buttonStyle={{ margin: `0 ${Spacing.S3}` }}
                  onClick={() => removeBook(_id)}
                  type="secondary"
                  color={Color.RED}
                  iconName="delete"
                  iconColor1={Color.RED}
                />
              </div>
              <Select
                options={isNationalOptions}
                value={isNationalOptions.find(
                  ({ value }) => value === isNational
                )}
                onChange={({ value }) =>
                  handleBookUpdate(_id, 'isNational', value)
                }
              />
            </FieldWrapper>

            {!isNational && (
              <FieldWrapper>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingBottom: 12,
                    alignItems: 'center',
                  }}
                >
                  <FormLabel>Select states:</FormLabel>
                  <button
                    style={{
                      border: '1px solid black',
                      padding: '4px 6px',
                      cursor: 'pointer',
                    }}
                    onClick={() =>
                      handleBookUpdate(_id, 'states', stateAbbreviations)
                    }
                  >
                    Select all states
                  </button>
                </div>

                <Select
                  isMulti
                  options={stateDropdownOptions}
                  value={states.map((state) => ({
                    label: state,
                    value: state,
                  }))}
                  onChange={(options) => {
                    let newSelectedStates = []

                    if (!_.isEmpty(options)) {
                      newSelectedStates = options.map(({ value }) => value)
                    }

                    handleBookUpdate(_id, 'states', newSelectedStates)
                  }}
                />
              </FieldWrapper>
            )}
          </FieldContainer>
        )
      })}
    </FormWrapper>
  )
}

export default ConnectionForm
