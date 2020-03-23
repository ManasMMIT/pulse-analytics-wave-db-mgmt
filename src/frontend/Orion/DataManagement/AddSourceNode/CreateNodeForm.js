import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/react-hooks'

import { CREATE_SOURCE_NODE } from '../../../api/mutations'

import { 
  FormLabel,
  StyledInput, 
  InputContainer,
  InputLabel,
  StyledButton,
} from './styledComponents'

import { Colors } from '../../../utils/pulseStyles'

const Form = ({ 
  parentId,
  refetchQueries,
 }) => {
  const defaultState = {
    parentId,
    name: '',
    type: '',
    componentPath: '',
    text: {
      subtitle: '',
      title: '',
      caption: '',
    },
    order: 100,
  }

  const [newNodeData, setNewNodeData] = useState(defaultState)

  useEffect(() => {
    setNewNodeData(state => ({ ...state, parentId }))
  }, [parentId])

  const [createNewNode] = useMutation(CREATE_SOURCE_NODE, {
    variables: { input: newNodeData },
    refetchQueries,
    onCompleted: result => {
      console.log(result)
      setNewNodeData(defaultState)
      alert('Write successful')
    },
    onError: e => alert(`Write failure: ${e.message}`),
    awaitRefetchQueries: true,
  })
  
  const handleInputChange = e => {
    let value = e.target.value
    const key = e.target.name

    let newTextObj = {}
    if (['subtitle', 'caption', 'title'].includes(e.target.name)) {
      newTextObj = { text: { ...newNodeData.text, [key]: value } }
      
      setNewNodeData(state => ({ ...state, ...newTextObj }))
      
      return
    }

    if (key === 'order') value = Number(value)

    setNewNodeData(state => ({ ...state, [key]: value }))
  }

  return (
    <div style={{ padding: 24, background: Colors.LIGHT_BLUE_GRAY_2  }}>
      <FormLabel>Add Child Node</FormLabel>

      <InputContainer>
        <InputLabel>Name:</InputLabel>
        <StyledInput
          value={newNodeData.name}
          name="name"
          type="text"
          onChange={handleInputChange}
        />
      </InputContainer>

      <InputContainer>
        <InputLabel>Type:</InputLabel>
        <StyledInput
          value={newNodeData.type}
          name="type"
          type="text"
          onChange={handleInputChange}
        />
      </InputContainer>

      <InputContainer>
        <InputLabel>Component Path:</InputLabel>
        <StyledInput
          value={newNodeData.componentPath}
          name="componentPath"
          type="text"
          onChange={handleInputChange}
        />
      </InputContainer>

      <InputContainer>
        <InputLabel>Order:</InputLabel>
        <StyledInput
          value={newNodeData.order}
          name="order"
          type="number"
          onChange={handleInputChange}
        />
      </InputContainer>

      <InputContainer>
        <InputLabel>Title:</InputLabel>
        <StyledInput
          value={newNodeData.text.title}
          name="title"
          type="text"
          onChange={handleInputChange}
        />
      </InputContainer>

      <InputContainer>
        <InputLabel>Subtitle:</InputLabel>
        <StyledInput
          value={newNodeData.text.subtitle}
          name="subtitle"
          type="text"
          onChange={handleInputChange}
        />
      </InputContainer>

      <InputContainer>
        <InputLabel>Caption:</InputLabel>
        <StyledInput
          value={newNodeData.text.caption}
          name="caption"
          type="text"
          onChange={handleInputChange}
        />
      </InputContainer>

      <StyledButton onClick={createNewNode}>Create New Node</StyledButton>
    </div>
  )
}

export default Form
