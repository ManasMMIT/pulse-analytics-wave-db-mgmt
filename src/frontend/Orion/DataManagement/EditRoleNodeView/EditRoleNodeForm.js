import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/react-hooks'

import {
  UPDATE_TEAM_NODE
} from '../../../api/mutations'

import {
  FormLabel,
  StyledInput,
  InputContainer,
  InputLabel,
  StyledButton,
} from './styledComponents'

import { Colors } from '../../../utils/pulseStyles'

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

  const handleInputChange = e => {
    let value = e.target.value
    const key = e.target.name

    let newTextObj = {}
    if (['subtitle', 'caption', 'title'].includes(key)) {
      newTextObj = { text: { ...nodeData.text, [key]: value } }

      setNodeData(state => ({ ...state, ...newTextObj }))

      return
    }

    if (key === 'order') value = Number(value)

    setNodeData(state => ({ ...state, [key]: value }))
  }

  return (
    <div style={{ padding: 24, background: Colors.LIGHT_BLUE_GRAY_2 }}>
      <FormLabel>Update Team Node</FormLabel>

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
          value={nodeData.type || ''}
          name="type"
          type="text"
          onChange={handleInputChange}
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

      <InputContainer>
        <InputLabel>Title:</InputLabel>
        <StyledInput
          value={nodeData.text.title || ''}
          name="title"
          type="text"
          onChange={handleInputChange}
        />
      </InputContainer>

      <InputContainer>
        <InputLabel>Subtitle:</InputLabel>
        <StyledInput
          value={nodeData.text.subtitle || ''}
          name="subtitle"
          type="text"
          onChange={handleInputChange}
        />
      </InputContainer>

      <InputContainer>
        <InputLabel>Caption:</InputLabel>
        <StyledInput
          value={nodeData.text.caption || ''}
          name="caption"
          type="text"
          onChange={handleInputChange}
        />
      </InputContainer>

      <StyledButton onClick={updateTeamNode}>
        Update Team Node
      </StyledButton>
    </div>
  )
}

export default EditRoleNodeForm
