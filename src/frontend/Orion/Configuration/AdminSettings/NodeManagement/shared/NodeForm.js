import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import queryString from 'query-string'
import _ from 'lodash'

import Color from 'frontend/utils/color'

import { GET_SOURCE_NODES } from 'frontend/api/queries'

import {
  FormLabel,
  StyledInput,
  InputContainer,
  InputLabel,
} from '../../EditRoleNodeView/styledComponents'

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

const getParentIdFromParams = (type, locationSearch) => {
  const {
    toolId: selectedToolId,
    dashboardId: selectedDashboardId,
    pageId: selectedPageId,
    // cardId: selectedCardId,
  } = locationSearch

  let parentId = null
  switch (type) {
    case 'tool':
      break
    case 'dashboard':
      parentId = selectedToolId
      break
    case 'page':
      parentId = selectedDashboardId
      break
    case 'card':
      parentId = selectedPageId
      break
    default:
      break
  }

  return parentId
}

const NodeForm = ({ data, setData, type }) => {
  // type is only used in create to determine parentId
  const { data: sourceNodeData, loading } = useQuery(GET_SOURCE_NODES)
  const location = useLocation()
  const [newTextField, setNewTextField] = useState(null)

  const locationSearch =
    (location.search && queryString.parse(location.search)) || {}

  const handleInputChange = (e) => {
    let value = e.target.value
    const key = e.target.name

    if (e.target.type === 'number') value = Number(value)

    setData((state) => ({ ...state, [key]: value }))
  }

  const handleTextInputChange = (e) => {
    let value = e.target.value
    const key = e.target.name

    const newTextObj = { text: { ...data.text, [key]: value } }

    setData((state) => ({ ...state, ...newTextObj }))
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
      data.text[camelCasedNewTextField] ||
      _.isEmpty(newTextField)
    ) {
      return null
    }

    setData((state) => ({
      ...state,
      text: { ...state.text, [camelCasedNewTextField]: null },
    }))
    setNewTextField('')
  }

  const handleRemoveTextField = (key) => {
    setData((state) => {
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
    data,
    handleTextInputChange,
    handleRemoveTextField
  )

  const newOrOldParentId =
    data.parentId || getParentIdFromParams(type, locationSearch)
  const isTool = !Boolean(newOrOldParentId)

  useEffect(() => {
    setData((state) => ({
      ...state,
      parentId: newOrOldParentId,
    }))
  }, [])

  let parent = null
  if (!loading)
    parent = sourceNodeData.nodes.find(({ _id }) => _id === newOrOldParentId)

  return (
    <div style={{ padding: 24, background: Color.LIGHT_BLUE_GRAY_2 }}>
      {!isTool && (
        <InputContainer>
          <InputLabel>Parent Node:</InputLabel>
          <StyledInput disabled value={parent.name} type="text" />
        </InputContainer>
      )}

      <InputContainer>
        <InputLabel>Name:</InputLabel>
        <StyledInput
          value={data.name || ''}
          name="name"
          type="text"
          onChange={handleInputChange}
        />
      </InputContainer>

      <InputContainer>
        <InputLabel>Type:</InputLabel>
        <StyledInput
          disabled
          value={data.type}
          name="type"
          type="text"
          onChange={() => alert('Type field should be disabled')}
        />
      </InputContainer>

      <InputContainer>
        <InputLabel>Component Path:</InputLabel>
        <StyledInput
          value={data.componentPath || ''}
          name="componentPath"
          type="text"
          onChange={handleInputChange}
        />
      </InputContainer>

      <InputContainer>
        <InputLabel>Order:</InputLabel>
        <StyledInput
          value={data.order}
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
    </div>
  )
}

export default NodeForm
