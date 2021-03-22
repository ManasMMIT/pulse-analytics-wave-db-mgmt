import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import Select from 'react-select'
import _ from 'lodash'

import Spinner from 'frontend/components/Spinner'

import { GET_SOURCE_INDICATIONS } from 'frontend/api/queries'
import useMarketBasketListData from '../useMarketBasketListData'

// TODO: Decide if we should exclude indications already selected in other MBs
const TileForm = ({
  onCompleted,
  data,
}) => {
  const isEdit = data

  data = data || { name: '', indication: null }
  const [formData, setFormData] = useState(data)
  const { data: indData, loading: indLoading } = useQuery(GET_SOURCE_INDICATIONS)
  const [ø, { marketBasket: { save, update } }] = useMarketBasketListData()
  const submit = isEdit ? update : save

  if (indLoading) return <Spinner />

  const { indications } = indData
  const indicationsByUuid = _.keyBy(indications, 'uuid')
  const indicationSelectOptions = indications.map(({ uuid, name }) => ({
    label: name,
    value: uuid,
  }))
  const selectedIndicationOption = {
    label: (indicationsByUuid[formData.indication] || {}).name,
    value: formData.indication,
  }

  const handleNameChange = e => {
    const name = e.target.value

    setFormData(prevData => ({ ...prevData, name }))
  }
  const handleSelectIndication = ({ value }) => {
    setFormData(prevData => ({ ...prevData, indication: value }))
  }

  const handleOnSubmit = e => {
    e.preventDefault()
    submit({ variables: { input: formData }, update: onCompleted })
  }

  return (
    <form onSubmit={handleOnSubmit}>
      <input
        placeholder="Enter name..."
        onChange={handleNameChange}
        value={formData.name}
      />
      <Select
        value={selectedIndicationOption}
        options={indicationSelectOptions}
        onChange={handleSelectIndication}
      />
      <button />
    </form>
  )
}

export default TileForm
