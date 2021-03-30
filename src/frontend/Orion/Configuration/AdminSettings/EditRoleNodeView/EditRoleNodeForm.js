import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/react-hooks'
import _ from 'lodash'

import Color from 'frontend/utils/color'

import {
  UPDATE_TEAM_NODE
} from '../../../../api/mutations'

import {
  FormLabel,
  StyledInput,
  InputContainer,
  InputLabel,
  StyledButton,
} from './styledComponents'

const EditRoleNodeForm = ({
  node,
  teamId,
  refetchQueries,
}) => {
  const [nodeData, setNodeData] = useState(node)

  useEffect(() => {
    setNodeData(node)
  }, [node])

  const [updateTeamNode] = useMutation(UPDATE_TEAM_NODE, {
    variables: {
      input: {
        nodeData,
        teamId,
      }
    },
    refetchQueries,
    onCompleted: ({ updateTeamNode }) => {
      console.log(updateTeamNode)
      setNodeData(updateTeamNode)
      alert('Write successful')
    },
    onError: e => alert(`Write failure: ${e.message}`),
    awaitRefetchQueries: true,
  })

  const [newTextField, setNewTextField] = useState(null)

  const handleInputChange = (e) => {
    let value = e.target.value
    const key = e.target.name

    if (e.target.type === 'number') value = Number(value)

    setNodeData((state) => ({ ...state, [key]: value }))
  }

  const handleTextInputChange = (e) => {
    let value = e.target.value
    const key = e.target.name

    const newTextObj = { text: { ...nodeData.text, [key]: value } }

    setNodeData((state) => ({ ...state, ...newTextObj }))
  }

  const handleAddTextField = () => {
    const camelCasedNewTextField = _.camelCase(newTextField)
    if (camelCasedNewTextField === 'tdgTimestamp') {
      alert('tdgTimestamp can not be set in this modal')
      setNewTextField('')
      return null
    }
    if (
      !newTextField ||
      nodeData.text[camelCasedNewTextField] ||
      _.isEmpty(newTextField)
    ) {
      return null
    }

    setNodeData((state) => ({
      ...state,
      text: { ...state.text, [camelCasedNewTextField]: null },
    }))
    setNewTextField('')
  }

  const handleRemoveTextField = (key) => {
    setNodeData((state) => {
      const clonedState = _.cloneDeep(state)
      const { text, ...restState } = clonedState

      delete text[key]

      return {
        text,
        ...restState,
      }
    })
  }

  const textInputs = getTextInputs(
    nodeData,
    handleTextInputChange,
    handleRemoveTextField
  )

  return (
    <div style={{ padding: 24, background: Color.LIGHT_BLUE_GRAY_2 }}>
      <InputContainer>
        <InputLabel>Name:</InputLabel>
        <StyledInput
          value={nodeData.name || ''}
          name="name"
          type="text"
          onChange={handleInputChange}
        />
      </InputContainer>

      <InputContainer>
        <InputLabel>Type:</InputLabel>
        <StyledInput
          disabled
          value={nodeData.type}
          name="type"
          type="text"
          onChange={() => alert('Type field should be disabled')}
        />
      </InputContainer>

      <InputContainer>
        <InputLabel>Component Path:</InputLabel>
        <StyledInput
          value={nodeData.componentPath || ''}
          name="componentPath"
          type="text"
          onChange={handleInputChange}
        />
      </InputContainer>

      <InputContainer>
        <InputLabel>Order:</InputLabel>
        <StyledInput
          value={nodeData.order}
          name="order"
          type="number"
          onChange={handleInputChange}
        />
      </InputContainer>
      <div style={{ padding: 12, border: `1px solid ${Color.MEDIUM_GRAY_1}` }}>
        <FormLabel>Text Object</FormLabel>
        {textInputs}
        <div>
          <InputContainer>
            <InputLabel>Add New Text Field</InputLabel>
            <div>
              <span style={{ fontWeight: 700 }}>Key Name: </span>
              <input
                style={{ background: Color.WHITE, margin: 12, padding: 6 }}
                value={newTextField}
                type="text"
                onChange={(e) => setNewTextField(e.target.value)}
              />
              <button
                style={{
                  padding: 6,
                  borderRadius: 4,
                  cursor: 'pointer',
                  display: 'inline',
                  background: Color.PRIMARY,
                  color: Color.WHITE,
                  fontWeight: 700,
                }}
                onClick={handleAddTextField}
              >
                Add
              </button>
            </div>
          </InputContainer>
        </div>
      </div>
      <StyledButton style={{ margin: 12 }} onClick={updateTeamNode}>SAVE</StyledButton>
    </div>
  )
}

export default EditRoleNodeForm

const getTextInputs = ({ text }, handleInputChange, handleRemoveTextField) => {
  const orderedKeys = Object.keys(text).sort()

  return orderedKeys.map((key) => {
    // ! this timestamp is being disabled because it's set elsewhere on Orion
    const isTdgTimestamp = Boolean(key === 'tdgTimestamp')

    return (
      <InputContainer key={key}>
        <InputLabel>{_.startCase(key)}</InputLabel>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <StyledInput
            disabled={isTdgTimestamp}
            style={{ flex: 25 }}
            value={text[key] || ''}
            name={key}
            type="text"
            onChange={handleInputChange}
          />
          {!isTdgTimestamp && (
            <button
              style={{
                borderRadius: 4,
                cursor: 'pointer',
                flex: 1,
                background: Color.RED,
                color: Color.WHITE,
                fontWeight: 700,
                padding: 6,
                margin: 6,
              }}
              onClick={() => handleRemoveTextField(key)}
            >
              -
            </button>
          )}
        </div>
      </InputContainer>
    )
  })
}
