import React, { useState } from 'react'
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks'
import { useParams } from 'react-router-dom'
import Select from 'react-select'
import _ from 'lodash'

import { GET_MARKET_BASKETS, GET_VEGA_PRODUCTS, GET_VEGA_PRODUCTS_REGIMENS } from 'frontend/api/queries'
import { UPDATE_MARKET_BASKET } from 'frontend/api/mutations'

import Spinner from 'frontend/components/Spinner'
import Button from 'frontend/components/Button'

// ! SANDBOX CAVEATS:
// * Not tracking selected items in state, so I don't clear form inputs after saving

const FORM_STYLE = {
  padding: 12,
  margin: 12,
  border: '1px solid grey',
}

const CreateForm = () => {
  const { marketBasketId } = useParams()
  const [selectedProductRegimenComboIds, setSelectedProductRegimenComboIds] = useState([])

  const { data, loading } = useQuery(GET_MARKET_BASKETS, { variables: { marketBasketId } })
  const { data: productData, loading: productLoading } = useQuery(GET_VEGA_PRODUCTS)
  const [
    fetchProductRegimenCombos,
    { data: productRegimenData, loading: productRegimenLoading, called }
  ] = useLazyQuery(GET_VEGA_PRODUCTS_REGIMENS)

  const fullSetProductsRegimens = getFullSetOfProductRegimenComboIds(
    selectedProductRegimenComboIds,
    data,
  )

  const [updateMarketBasket] = useMutation(UPDATE_MARKET_BASKET,
    {
      variables: { input: { id: marketBasketId, products_regimens: fullSetProductsRegimens } },
      onCompleted: () => {
        setSelectedProductRegimenComboIds([])
      }
    }
  )

  const handleCreate = e => {
    e.preventDefault()
    updateMarketBasket()
  }

  if (loading || productLoading) return <Spinner />
  const [marketBasket] = data.marketBaskets

  let regimenOptions = getRegimenOptions(productRegimenLoading, called, productRegimenData)
  const productSelectOptions = getProductSelectOptions(productData, marketBasket)

  const handleProductOnChange = ({ value }) => {
    fetchProductRegimenCombos({ variables: { input: { productId: value } } })
  }

  const handleRegimensOnChange = (options) => {
    // ! if last item is X'd out, options is null
    const selectedRegimenOptions = options || []
    const selectedComboIds = selectedRegimenOptions.map(({ value }) => value)
    setSelectedProductRegimenComboIds(selectedComboIds)
  }

  const isProductSelectDisabled = !regimenOptions.length
  let productPlaceholderText = 'select product\'s regimens'
  if (productRegimenLoading) productPlaceholderText = <Spinner />
  else if (isProductSelectDisabled) productPlaceholderText = 'select product first to choose regimens'

  return (
    <form
      style={FORM_STYLE}
      onSubmit={handleCreate}
    >
      <h3>Create Form</h3>
      <Select
        placeholder={'select a new product'}
        options={productSelectOptions}
        onChange={handleProductOnChange}
      />
      <Select
        isMulti
        isDisabled={isProductSelectDisabled}
        placeholder={productPlaceholderText}
        options={regimenOptions}
        onChange={handleRegimensOnChange}
      />
      <Button>
        Add Product-Regimens
      </Button>
    </form>
  )
}

export default CreateForm

const getFullSetOfProductRegimenComboIds = (selectedProductRegimenComboIds, { marketBaskets }) => {
  const [marketBasket] = marketBaskets
  const marketBasketProdRegComboIds = marketBasket.products_regimens.map(({ id }) => id)

  return [...marketBasketProdRegComboIds, ...selectedProductRegimenComboIds]
}

const getProductSelectOptions = (productData, marketBasket) => {
  const validNewProducts = getValidNewProducts(productData, marketBasket)

  const productSelectOptions = validNewProducts.map(({ id, generic_name }) => ({
    label: generic_name,
    value: id,
  }))
  return productSelectOptions
}

const getValidNewProducts = (productData, marketBasket) => {
  const { vegaProducts } = productData
  const { products_regimens: alreadyAddedProductRegCombos } = marketBasket || { products_regimens: [] }
  const alreadyAddedProductsIdMap = _.keyBy(alreadyAddedProductRegCombos, 'product.id')

  return vegaProducts.filter(({ id: localId }) => !alreadyAddedProductsIdMap[localId])
}

const getRegimenOptions = (productRegimenLoading, called, productRegimenData) => {
  let regimenOptions = []
  if (!productRegimenLoading && called) {
    const { vegaProductsRegimens } = productRegimenData

    regimenOptions = vegaProductsRegimens.map(({
      id: comboId,
      regimen: { name }
    }) => ({
      label: name,
      value: comboId,
    }))
  }
  return regimenOptions
}

