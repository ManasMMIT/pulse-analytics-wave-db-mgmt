import React, { useEffect, useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { useParams } from 'react-router-dom'
import Select from 'react-select'
import _ from 'lodash'

import {
  GET_MARKET_BASKETS,
  GET_VEGA_PRODUCTS_REGIMENS,
} from 'frontend/api/queries'
import { UPDATE_MARKET_BASKET } from 'frontend/api/mutations'

import Spinner from 'frontend/components/Spinner'
import Button from 'frontend/components/Button'

const FORM_STYLE = {
  padding: 12,
  margin: 12,
  border: '1px solid grey',
}

const UpdateForm = ({ product }) => {
  const { marketBasketId } = useParams()

  const [
    marketBasketProdRegComboIds,
    setMarketBasketProdRegComboIds,
  ] = useState([])
  const [
    selectedRegimenComboOptions,
    setSelectedRegimenComboOptions,
  ] = useState([])

  console.log(marketBasketProdRegComboIds)
  const { data, loading } = useQuery(GET_MARKET_BASKETS, {
    variables: { marketBasketId },
  })
  const {
    data: productRegimenData,
    loading: productRegimenLoading,
  } = useQuery(GET_VEGA_PRODUCTS_REGIMENS, {
    variables: { input: { productId: product.id } },
  })

  useEffect(() => {
    if (!loading) {
      const { products_regimens } = data.marketBaskets && data.marketBaskets[0]
      setMarketBasketProdRegComboIds(products_regimens.map(({ id }) => id))

      const selectedProductRegimenComboOptions = products_regimens
        .filter(
          ({ product: { id: localProdId } }) => localProdId === product.id
        )
        .map(({ id, regimen: { name } }) => ({
          label: name,
          value: Number(id),
        }))

      setSelectedRegimenComboOptions(selectedProductRegimenComboOptions)
    }
  }, [loading])

  let regimenOptions = []
  if (!productRegimenLoading) {
    regimenOptions = Object.values(productRegimenData)[0]
      .filter(({ id }) => !marketBasketProdRegComboIds.includes(Number(id)))
      .map(({ id, regimen: { name } }) => ({
        label: name,
        value: Number(id),
      }))
  }

  const [updateMarketBasket, { loading: isUpdating }] = useMutation(
    UPDATE_MARKET_BASKET,
    {
      variables: {
        input: {
          id: marketBasketId,
          products_regimens: marketBasketProdRegComboIds,
        },
      },
    }
  )

  if (loading || productRegimenLoading) return <Spinner />

  const handleRegimensOnChange = (options) => {
    const selectedRegimenCombos = options || []
    // ? Do I have this backwards?
    const toAdd = _.difference(
      selectedRegimenCombos,
      selectedRegimenComboOptions
    ).map(({ value }) => value)
    const toRemove = _.difference(selectedRegimenComboOptions, options).map(
      ({ value }) => value
    )
    const filteredMarketBasketProdRegComboIds = marketBasketProdRegComboIds.filter(
      (id) => !toRemove.includes(id)
    )

    const finalSetOfComboIds = [
      ...filteredMarketBasketProdRegComboIds,
      ...toAdd,
    ]

    setMarketBasketProdRegComboIds(finalSetOfComboIds)
    setSelectedRegimenComboOptions(selectedRegimenCombos)
  }

  const handleUpdate = (e) => {
    e.preventDefault()
    updateMarketBasket()
  }

  return (
    <form style={FORM_STYLE} onSubmit={handleUpdate}>
      <h3>{`Update Form / ${product.name}`}</h3>
      <Select
        isDisabled
        value={{ label: product.generic_name, value: product.id }}
      />
      <Select
        isMulti
        value={selectedRegimenComboOptions}
        options={regimenOptions}
        onChange={handleRegimensOnChange}
      />
      {isUpdating ? <Spinner /> : <Button>Add Product-Regimens</Button>}
    </form>
  )
}

export default UpdateForm
