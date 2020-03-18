import React, { useState } from 'react'
import styled from '@emotion/styled'

const Wrapper = styled.section({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'aliceblue',
  padding: 12,
})

const FieldCard = ({ sectionData, inputFields, setInputField }) => {
  const { label, fields } = sectionData

  const handleChange = event => {
    event.persist()
    setInputField(inputs => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }))
  }

  console.log(inputFields)

  return (
    <Wrapper>
      <h2>{label}</h2>
      {fields.map(({ _id, label, key }) => (
        <span key={_id}>
          <h3>{label}</h3>
          <input
            type="text"
            name={key}
            onChange={handleChange}
            value={inputFields[key]}
          />
        </span>
      ))}
    </Wrapper>
  )
}

export default FieldCard
