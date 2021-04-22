import React, { useState } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import Select from 'react-select'
import _ from 'lodash'
import styled from '@emotion/styled'

import { SingleActionDialog } from 'frontend/components/Dialog'
import Input from 'frontend/components/Input'
import Spinner from 'frontend/components/Spinner'
import {
  GET_MARKET_BASKETS,
  GET_SOURCE_INDICATIONS,
} from 'frontend/api/queries'
import {
  CREATE_MARKET_BASKET,
  UPDATE_MARKET_BASKET,
} from 'frontend/api/mutations'

import FontSpace from 'frontend/utils/fontspace'
import Spacing from 'frontend/utils/spacing'

const InputLabel = styled.div({
  ...FontSpace.FS2,
})

// TODO: Decide if we should exclude indications already selected in other MBs
const MarketBasketForm = ({ onCompleted, cancelHandler, data }) => {
  const isEdit = Boolean(data)
  data = data || { name: '', indication: null, description: '' }
  const [formData, setFormData] = useState(data)

  const { data: indData, loading: indLoading } = useQuery(
    GET_SOURCE_INDICATIONS
  )
  const { data: marketBasketData } = useQuery(GET_MARKET_BASKETS)

  const mutationDoc = isEdit ? UPDATE_MARKET_BASKET : CREATE_MARKET_BASKET
  const [submit] = useMutation(mutationDoc, {
    onError: alert,
    update: (cache, { data }) => {
      const { createMarketBasket } = data

      if (createMarketBasket) {
        const newMbs = [...marketBasketData.marketBaskets, createMarketBasket]

        cache.writeQuery({
          query: GET_MARKET_BASKETS,
          data: { marketBaskets: newMbs },
        })
      }
    },
    onCompleted,
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

  const handleInputChange = ({ name, value }) => {
    const key = name || 'indication'

    setFormData((prevData) => ({ ...prevData, [key]: value }))
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()
    submit({ variables: { input: formData } })
  }

  return (
    <SingleActionDialog
      header="Create New Market Basket"
      submitText="Create Market Basket"
      submitHandler={handleOnSubmit}
      cancelHandler={cancelHandler}
    >
      <div style={{ padding: Spacing.S7 }}>
        <InputLabel>
          <label style={{ fontWeight: 700 }}>Name (required)</label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter name..."
            style={{
              display: 'block',
              background: 'white',
              padding: 12,
              width: '100%',
            }}
          />
        </InputLabel>
        <InputLabel style={{ marginTop: Spacing.S7 }}>
          <label style={{ fontWeight: 700 }}>Indication (required)</label>
          <Select
            value={selectedIndicationOption}
            options={indicationSelectOptions}
            onChange={handleInputChange}
          />
        </InputLabel>
        <InputLabel style={{ marginTop: Spacing.S7 }}>
          <label style={{ fontWeight: 700 }}>Description</label>
          <Input
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter description..."
            style={{
              display: 'block',
              background: 'white',
              padding: 12,
              width: '100%',
            }}
          />
        </InputLabel>
      </div>
    </SingleActionDialog>
  )
}

export default MarketBasketForm
