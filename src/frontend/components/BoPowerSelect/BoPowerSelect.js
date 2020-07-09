import React, { useState } from 'react'
import Select from 'react-select'
import { useQuery } from '@apollo/react-hooks'

import { customSelectStyles } from '../customSelectStyles'

const getSelectProps = (data, selectedId, getLabel) => {
  const entities = Object.values(data)[0] || []

  const options = entities.map((entity) => ({
    label: getLabel(entity),
    value: entity._id,
  }))

  const selectedObm = entities.find(({ _id }) => _id === selectedId)
  const value = selectedObm ? { label: selectedObm.organization, value: selectedObm._id } : null
  return { value, options }
}

const BoPowerSelect = ({ getLabel, placeholder, queryDoc, Modal }) => {
  const [selectedId, selectId] = useState(null)
  const { data, loading } = useQuery(queryDoc)

  if (loading) return null

  const { value, options } = getSelectProps(data, selectedId, getLabel)

  return (
    <div style={{ margin: 12, minWidth: 200 }}>
      <Select
        placeholder={placeholder}
        styles={customSelectStyles}
        value={value}
        options={options}
        onChange={({ value }) => selectId(value)}
      />
      {value && <Modal entityId={selectedId} closeModal={() => selectId(null)} />}
    </div>
  )
}

const BoPowerSelectContainer = (props) => {
  if (!props.queryDoc) return null

  return <BoPowerSelect {...props} />
}

export default BoPowerSelectContainer
