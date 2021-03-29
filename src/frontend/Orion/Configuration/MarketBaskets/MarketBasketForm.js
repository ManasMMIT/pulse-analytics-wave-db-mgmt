import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useMutation, useQuery, useApolloClient } from '@apollo/react-hooks'
import Select from 'react-select'
import _ from 'lodash'

import Spinner from 'frontend/components/Spinner'
import Button from 'frontend/components/Button'
import { GET_MARKET_BASKETS, GET_SOURCE_INDICATIONS } from 'frontend/api/queries'
import { CREATE_MARKET_BASKET, UPDATE_MARKET_BASKET, DELETE_MARKET_BASKET } from 'frontend/api/mutations'

// TODO: Decide if we should exclude indications already selected in other MBs
const MarketBasketForm = ({
  onCompleted,
  data,
}) => {
  const isEdit = Boolean(data)
  const history = useHistory()
  data = data || { name: '', indication: null, description: '' }
  const [formData, setFormData] = useState(data)

  const { data: indData, loading: indLoading } = useQuery(GET_SOURCE_INDICATIONS)
  const { data: marketBasketData } = useQuery(GET_MARKET_BASKETS)
  const apolloClient = useApolloClient()

  const mutationDoc = isEdit ? UPDATE_MARKET_BASKET : CREATE_MARKET_BASKET
  const [submit] = useMutation(mutationDoc, {
    onError: alert,
    onCompleted,
  })

  const [deleteMarketBasket] = useMutation(DELETE_MARKET_BASKET, {
    onError: alert,
    onCompleted: ({ deleteMarketBasket }) => {
      const newMbs = marketBasketData.marketBaskets
        .filter(({ id }) => id !== deleteMarketBasket.id)

      apolloClient.cache.writeQuery({
        query: GET_MARKET_BASKETS,
        data: { marketBaskets: newMbs },
      })
      onCompleted(deleteMarketBasket)
      history.push("/orion/configuration/market-baskets")
    }
  })

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

  const handleDescriptionChange = e => {
    const description = e.target.value

    setFormData(prevData => ({ ...prevData, description }))
  }

  const handleSelectIndication = ({ value }) => {
    setFormData(prevData => ({ ...prevData, indication: value }))
  }

  const handleOnSubmit = e => {
    e.preventDefault()
    submit({ variables: { input: formData } })
  }

  const handleOnDelete = e => {
    e.stopPropagation()
    deleteMarketBasket({ variables: { input: { id: data.id } } })
  }

  return (
    <form onSubmit={handleOnSubmit}>
      <div style={{ padding: 12 }}>
        <label style={{ fontWeight: 700 }}>Name</label>
        <input
          style={{ display: 'block', background: 'white', padding: 12 }}
          placeholder="Enter name..."
          onChange={handleNameChange}
          value={formData.name}
        />
      </div>
      <div style={{ padding: 12 }}>
        <label style={{ fontWeight: 700 }}>Description</label>
        <div></div>
        <input
          style={{ display: 'block', background: 'white', padding: 12 }}
          placeholder="Enter description..."
          onChange={handleDescriptionChange}
          value={formData.description}
        />
      </div>
      <div style={{ padding: 12 }}>
        <label style={{ fontWeight: 700 }}>Indication</label>
        <div></div>
        <Select
          value={selectedIndicationOption}
          options={indicationSelectOptions}
          onChange={handleSelectIndication}
        />
      </div>
      <Button buttonStyle={{ margin: 12 }}>Save</Button>
      {isEdit && (
        <Button
          color="red"
          onClick={handleOnDelete}
          buttonStyle={{ margin: 12 }}
        >
          Delete
        </Button>
      )}
    </form>
  )
}

export default MarketBasketForm
