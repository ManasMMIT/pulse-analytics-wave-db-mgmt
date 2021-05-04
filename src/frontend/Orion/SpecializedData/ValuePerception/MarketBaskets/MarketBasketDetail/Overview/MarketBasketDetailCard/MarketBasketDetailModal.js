import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import Select from 'react-select'
import _ from 'lodash'

import { Button } from '@pulse-analytics/pulse-design-system'

import Modal from 'frontend/components/Modal'
import Spinner from 'frontend/components/Spinner'
import Input from 'frontend/components/Input'

import {
  GET_MARKET_BASKETS,
  GET_SOURCE_INDICATIONS,
} from 'frontend/api/queries'
import {
  UPDATE_MARKET_BASKET,
  DELETE_MARKET_BASKET,
} from 'frontend/api/mutations'

const FormLabel = styled.label({
  fontSize: 12,
  fontWeight: 700,
  lineHeight: '20px',
})

const MarketBasketDetailModal = ({
  closeModal,
  isModalOpen,
  name,
  marketBasket,
}) => {
  const history = useHistory()

  const { id, indication, description } = marketBasket

  const [formData, setFormData] = useState({
    id,
    name,
    indication: indication.id,
    description,
  })

  const { data: indData, loading: indLoading } = useQuery(
    GET_SOURCE_INDICATIONS
  )
  const { data: marketBasketData } = useQuery(GET_MARKET_BASKETS)

  const [submit, { loading: mutationLoading }] = useMutation(
    UPDATE_MARKET_BASKET,
    {
      onError: alert,
      onCompleted: () => closeModal(),
    }
  )

  const [deleteMarketBasket] = useMutation(DELETE_MARKET_BASKET, {
    onError: alert,
    update: (cache, { data: { deleteMarketBasket } }) => {
      const newMbs = marketBasketData.marketBaskets.filter(
        ({ id }) => id !== deleteMarketBasket.id
      )

      cache.writeQuery({
        query: GET_MARKET_BASKETS,
        data: { marketBaskets: newMbs },
      })
    },
    onCompleted: () => {
      history.push('/orion/specialized/value-perception/market-baskets')
    },
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

  const handleOnSubmit = (e) => {
    e.preventDefault()
    submit({ variables: { input: formData } })
  }

  // const handleOnDelete = (e) => {
  //   e.stopPropagation()
  //   deleteMarketBasket({ variables: { input: { id } } })
  // }

  const handleChange = ({ name, value }) => {
    const key = name || 'indication'
    setFormData((prevData) => ({ ...prevData, [key]: value }))
  }

  console.log(formData)
  return (
    <Modal
      title="Edit Market Basket"
      handleClose={closeModal}
      show={isModalOpen}
      width={500}
    >
      {mutationLoading ? (
        <Spinner />
      ) : (
        <>
          <form>
            <h4>Details</h4>
            <div>
              <FormLabel>Name (required)</FormLabel>
              <Input
                name="name"
                type="text"
                onChange={handleChange}
                value={formData.name}
              />
            </div>
            <div>
              <FormLabel>Indication (required)</FormLabel>
              <Select
                value={selectedIndicationOption}
                options={indicationSelectOptions}
                onChange={handleChange}
              />
            </div>
            <div>
              <FormLabel>Description</FormLabel>
              <Input
                name="description"
                type="text"
                onChange={handleChange}
                value={formData.description}
              />
            </div>
          </form>
          <div>
            <h4>Delete Market Basket</h4>
            <p>
              Deleting the Market Basket removes all data associated with it and
              cannot be undone.
            </p>
            {/* <Button color="red" onClick={handleOnDelete}>
              Delete Market Basket
            </Button> */}
          </div>
          <div>
            <Button onClick={closeModal}>Cancel</Button>
            <Button onClick={handleOnSubmit}>Update Market Basket</Button>
          </div>
        </>
      )}
    </Modal>
  )
}

export default MarketBasketDetailModal
